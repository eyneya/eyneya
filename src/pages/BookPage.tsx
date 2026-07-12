import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Check, ChevronRight, ChevronLeft, Calendar, Clock, User, FileText,
  CheckCircle2, AlertCircle, Loader2, Download, Home, Plus,
} from 'lucide-react';
import Seo from '../components/Seo';
import { Section } from '../components/ui/Section';
import BookingCalendar from '../components/BookingCalendar';
import { fetchServices } from '../lib/services';
import { supabase } from '../lib/supabase';
import { generateBookingReference, downloadIcs, cn } from '../lib/utils';
import { BUSINESS } from '../lib/constants';
import type { Service, ServiceTier, Slot } from '../lib/types';

const STEPS = [
  { label: 'Service', icon: FileText },
  { label: 'Date & Time', icon: Calendar },
  { label: 'Your Info', icon: User },
  { label: 'Confirmation', icon: CheckCircle2 },
];

const intakeSchema = z.object({
  full_name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  filing_status: z.string().optional(),
  tax_year: z.string().optional(),
  has_business_income: z.boolean().default(false),
  has_investments: z.boolean().default(false),
  has_rental_income: z.boolean().default(false),
  has_prior_year_issues: z.boolean().default(false),
  additional_context: z.string().optional(),
});

type IntakeData = z.infer<typeof intakeSchema>;

interface CreatedBooking {
  booking_reference: string;
  service_name: string;
  tier_name: string;
  appointment_start: string;
  appointment_end: string;
  timezone: string;
}

export default function BookPage() {
  const [params] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTier, setSelectedTier] = useState<ServiceTier | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [createdBooking, setCreatedBooking] = useState<CreatedBooking | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IntakeData>({ resolver: zodResolver(intakeSchema) });

  useEffect(() => {
    fetchServices()
      .then((s) => {
        setServices(s);
        setLoading(false);
        const preService = params.get('service');
        const preTier = params.get('tier');
        if (preService) {
          const svc = s.find((sv) => sv.id === preService || sv.slug === preService);
          if (svc) {
            setSelectedService(svc);
            if (preTier) {
              const tier = svc.service_tiers?.find((t) => t.id === preTier);
              if (tier) setSelectedTier(tier);
            }
            setStep(2);
          }
        }
      })
      .catch(() => setLoading(false));
  }, [params]);

  const isPrepCategory = selectedService?.category === 'preparation';
  const isAdvisoryOrPlanning = selectedService?.category === 'advisory' || selectedService?.category === 'planning';

  const onPickService = (service: Service) => {
    setSelectedService(service);
    setSelectedTier(null);
  };

  const onPickTier = (tier: ServiceTier) => {
    setSelectedTier(tier);
    setStep(2);
  };

  const canAdvanceFromStep2 = !!selectedDate && !!selectedSlot;

  const onSubmitIntake = async (data: IntakeData) => {
    if (!selectedService || !selectedTier || !selectedSlot) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const bookingRef = generateBookingReference();

      // Upsert client by email
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('email', data.email)
        .maybeSingle();

      let clientId = existingClient?.id;

      if (!clientId) {
        const { data: newClient, error: clientErr } = await supabase
          .from('clients')
          .insert({
            email: data.email,
            full_name: data.full_name,
            phone: data.phone || null,
            address_city: data.city || null,
            address_state: data.state || null,
            source: 'booking',
            tax_situation: data.additional_context || null,
          })
          .select('id')
          .single();
        if (clientErr) throw new Error(clientErr.message);
        clientId = newClient.id;
      }

      // Create booking
      const { error: bookingErr } = await supabase.from('bookings').insert({
        booking_reference: bookingRef,
        client_id: clientId,
        service_id: selectedService.id,
        service_tier_id: selectedTier.id,
        service_name: selectedService.name,
        tier_name: selectedTier.name,
        price_display: selectedTier.price_display,
        status: 'confirmed',
        appointment_start: selectedSlot.iso_start,
        appointment_end: selectedSlot.iso_end,
        timezone: BUSINESS.timeZone,
        client_notes: data.additional_context || null,
        filing_status: data.filing_status || null,
        tax_year: data.tax_year || null,
        has_business_income: data.has_business_income,
        has_investments: data.has_investments,
        has_rental_income: data.has_rental_income,
        has_prior_year_issues: data.has_prior_year_issues,
        additional_context: data.additional_context || null,
        payment_status: selectedTier.is_fixed_price ? 'unpaid' : 'unpaid',
        source: 'website',
      });
      if (bookingErr) throw new Error(bookingErr.message);

      setCreatedBooking({
        booking_reference: bookingRef,
        service_name: selectedService.name,
        tier_name: selectedTier.name,
        appointment_start: selectedSlot.iso_start,
        appointment_end: selectedSlot.iso_end,
        timezone: BUSINESS.timeZone,
      });
      setStep(4);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong creating your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Seo title="Book a Tax Appointment | Eyneya Business Solutions" description="Book a tax appointment online." path="/book" />
        <div className="container-wide py-32">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Book a Tax Appointment | Eyneya Business Solutions — Kennesaw, GA"
        description="Book a tax preparation, advisory, planning, or strategy appointment with Eyneya Business Solutions. Online booking available for clients in Kennesaw, Marietta, and Metro Atlanta."
        path="/book"
      />

      <div className="bg-gradient-to-b from-brand-purple-light to-white py-10">
        <div className="container-wide">
          <h1 className="text-3xl sm:text-4xl font-bold">Book an Appointment</h1>
          <p className="mt-2 text-brand-slate">Choose a service, pick a time, and receive your confirmation instantly.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="border-b border-gray-100 bg-white sticky top-16 lg:top-20 z-30">
        <div className="container-wide py-4">
          <ol className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((s, i) => {
              const idx = i + 1;
              const isDone = step > idx;
              const isActive = step === idx;
              const Icon = s.icon;
              return (
                <li key={s.label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition-colors',
                        isDone ? 'bg-brand-success text-white' : isActive ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-400',
                      )}
                    >
                      {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </span>
                    <span className={cn('hidden sm:block text-sm font-semibold', isActive ? 'text-brand-purple' : 'text-brand-slate')}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && <div className={cn('flex-1 h-0.5 mx-2 sm:mx-3', isDone ? 'bg-brand-success' : 'bg-gray-200')} />}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <Section bg="white" className="!pt-10">
        {/* Step 1: Choose Service */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Choose a Service</h2>
            <p className="text-brand-slate mb-8">Select a service to see pricing options.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onPickService(s)}
                  className={cn(
                    'card card-pad text-left transition-all hover:shadow-card-hover',
                    selectedService?.id === s.id && 'ring-2 ring-brand-purple shadow-card-hover',
                  )}
                >
                  <h3 className="font-bold text-brand-dark">{s.name}</h3>
                  <p className="mt-1.5 text-sm text-brand-slate leading-relaxed">{s.description}</p>
                  <p className="mt-3 text-sm font-semibold text-brand-purple">{s.duration_minutes} min session</p>
                </button>
              ))}
            </div>

            {selectedService && selectedService.service_tiers && selectedService.service_tiers.length > 0 && (
              <div className="mt-10 animate-fade-up">
                <h3 className="text-xl font-bold mb-4">Choose a Pricing Option for {selectedService.name}</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedService.service_tiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => onPickTier(tier)}
                      className={cn(
                        'card card-pad text-left transition-all hover:shadow-card-hover',
                        selectedTier?.id === tier.id && 'ring-2 ring-brand-purple shadow-card-hover',
                      )}
                    >
                      <h4 className="font-bold text-brand-dark">{tier.name}</h4>
                      <p className="mt-2 text-xl font-bold text-brand-purple font-serif">{tier.price_display}</p>
                      <p className="mt-2 text-sm text-brand-slate leading-relaxed">{tier.best_for}</p>
                      {tier.is_recurring && <span className="badge-gold mt-3 inline-flex">Recurring plan</span>}
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedTier}
                    className="btn-purple"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && selectedService && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Choose a Date & Time</h2>
                <p className="text-brand-slate mt-1">
                  {selectedService.name} · {selectedTier?.name} · {selectedTier?.price_display}
                </p>
              </div>
              <button onClick={() => setStep(1)} className="btn-ghost btn-sm">
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            </div>
            <BookingCalendar
              serviceId={selectedService.id}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onDateSelect={setSelectedDate}
              onSlotSelect={setSelectedSlot}
            />
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-brand-slate flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {selectedDate && selectedSlot
                  ? `${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${selectedSlot.start}`
                  : 'Select a date and time to continue'}
              </p>
              <button
                onClick={() => setStep(3)}
                disabled={!canAdvanceFromStep2}
                className="btn-purple"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Intake */}
        {step === 3 && selectedService && selectedTier && selectedSlot && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Your Information</h2>
                <p className="text-brand-slate mt-1">Tell us about your tax situation so we can prepare.</p>
              </div>
              <button onClick={() => setStep(2)} className="btn-ghost btn-sm">
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            </div>

            {/* Summary */}
            <div className="card card-pad mb-6 bg-brand-purple-light border-brand-purple/20">
              <div className="grid gap-4 sm:grid-cols-3 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple">Service</p>
                  <p className="font-semibold text-brand-dark mt-1">{selectedService.name}</p>
                  <p className="text-brand-slate">{selectedTier.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple">Date & Time</p>
                  <p className="font-semibold text-brand-dark mt-1">
                    {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-brand-slate">{selectedSlot.start} — {selectedSlot.end} EST</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple">Pricing</p>
                  <p className="font-semibold text-brand-purple mt-1">{selectedTier.price_display}</p>
                  {selectedTier.is_fixed_price ? (
                    <p className="text-brand-slate">Payment due at booking</p>
                  ) : (
                    <p className="text-brand-slate">Final price confirmed after review</p>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmitIntake)} className="card card-pad space-y-5">
              {/* Contact info */}
              <div>
                <h3 className="font-bold text-brand-dark mb-4">Contact Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Full Name *</label>
                    <input className="input" {...register('full_name')} placeholder="Jane Doe" />
                    {errors.full_name && <p className="mt-1 text-sm text-brand-error">{errors.full_name.message}</p>}
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input type="email" className="input" {...register('email')} placeholder="jane@example.com" />
                    {errors.email && <p className="mt-1 text-sm text-brand-error">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input className="input" {...register('phone')} placeholder="(770) 555-0142" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">City</label>
                      <input className="input" {...register('city')} placeholder="Kennesaw" />
                    </div>
                    <div>
                      <label className="label">State</label>
                      <input className="input" {...register('state')} placeholder="GA" maxLength={3} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax-specific intake */}
              {isPrepCategory && (
                <div className="border-t border-gray-100 pt-5">
                  <h3 className="font-bold text-brand-dark mb-4">Tax Filing Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Filing Status</label>
                      <select className="input" {...register('filing_status')}>
                        <option value="">Select...</option>
                        <option>Single</option>
                        <option>Married Filing Jointly</option>
                        <option>Married Filing Separately</option>
                        <option>Head of Household</option>
                        <option>Qualifying Surviving Spouse</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Tax Year</label>
                      <select className="input" {...register('tax_year')}>
                        <option value="">Select...</option>
                        <option>2024</option>
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021 or earlier</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-brand-dark">Check all that apply:</p>
                    {[
                      { key: 'has_business_income', label: 'I have self-employment or business income' },
                      { key: 'has_investments', label: 'I have investment income (stocks, crypto, etc.)' },
                      { key: 'has_rental_income', label: 'I have rental or real estate income' },
                      { key: 'has_prior_year_issues', label: 'I have prior-year tax issues or unfiled returns' },
                    ].map((c) => (
                      <label key={c.key} className="flex items-center gap-2.5 text-sm text-brand-dark">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple" {...register(c.key as keyof IntakeData)} />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {isAdvisoryOrPlanning && (
                <div className="border-t border-gray-100 pt-5">
                  <h3 className="font-bold text-brand-dark mb-4">Your Tax Situation</h3>
                  <label className="label">Describe your situation or question</label>
                  <textarea rows={4} className="input" {...register('additional_context')} placeholder="Tell us what you need help with..." />
                </div>
              )}

              {/* Payment note */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-start gap-3 rounded-lg bg-brand-gold-light p-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-brand-warning" />
                  <div className="text-sm">
                    <p className="font-semibold text-brand-dark">
                      {selectedTier.is_fixed_price
                        ? `Payment of ${selectedTier.price_display} will be collected to confirm your booking.`
                        : 'This service has a custom or range-based price.'}
                    </p>
                    <p className="text-brand-slate mt-1">
                      {selectedTier.is_fixed_price
                        ? 'You will receive a payment link and confirmation email after booking.'
                        : 'No payment is due now. Final pricing is confirmed after document review or consultation.'}
                    </p>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-brand-error">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
                <p className="text-xs text-brand-slate">
                  By booking, you agree to be contacted about your appointment. We respect your privacy.
                </p>
                <button type="submit" disabled={submitting} className="btn-purple">
                  {submitting ? 'Confirming...' : 'Confirm Booking'}
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && createdBooking && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="card card-pad text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-brand-success">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <h2 className="mt-5 text-3xl font-bold">Your Appointment is Confirmed</h2>
              <p className="mt-2 text-brand-slate">
                A confirmation email is on its way to you. You will also receive a reminder before your appointment.
              </p>

              <div className="mt-8 rounded-xl bg-brand-purple-light p-6 text-left">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple">Booking Reference</p>
                    <p className="font-bold text-brand-dark mt-1 font-mono">{createdBooking.booking_reference}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple">Service</p>
                    <p className="font-semibold text-brand-dark mt-1">{createdBooking.service_name}</p>
                    <p className="text-sm text-brand-slate">{createdBooking.tier_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple">Date</p>
                    <p className="font-semibold text-brand-dark mt-1">
                      {new Date(createdBooking.appointment_start).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple">Time</p>
                    <p className="font-semibold text-brand-dark mt-1">
                      {new Date(createdBooking.appointment_start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      {' — '}
                      {new Date(createdBooking.appointment_end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} EST
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => downloadIcs(createdBooking)}
                  className="btn-outline"
                >
                  <Download className="h-4 w-4" />
                  Add to Calendar
                </button>
                <Link to="/" className="btn-ghost">
                  <Home className="h-4 w-4" />
                  Return Home
                </Link>
                <Link to="/book" className="btn-ghost" onClick={() => window.location.reload()}>
                  <Plus className="h-4 w-4" />
                  Book Another
                </Link>
              </div>

              <p className="mt-8 text-xs text-brand-slate">
                Need to cancel or reschedule? Email us at{' '}
                <a href={`mailto:${BUSINESS.email}`} className="text-brand-purple font-semibold">{BUSINESS.email}</a>
                {' '}with your booking reference.
              </p>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
