import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, Clock, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { Section } from '../components/ui/Section';
import FaqAccordion, { type FaqItem } from '../components/ui/FaqAccordion';
import { supabase } from '../lib/supabase';
import { BUSINESS } from '../lib/constants';
import { generalFaqs } from '../lib/content';

const schema = z.object({
  full_name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  service_interest: z.string().optional(),
  message: z.string().min(10, 'Please tell us a bit more (at least 10 characters)'),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    const { error } = await supabase.from('contact_submissions').insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      service_interest: data.service_interest || null,
      message: data.message,
      source_page: 'contact',
      status: 'new',
    });
    if (error) {
      setSubmitError('Something went wrong submitting your message. Please try again or email us directly.');
      return;
    }
    setSubmitted(true);
    reset();
  };

  const FAQS: FaqItem[] = generalFaqs();

  return (
    <>
      <Seo
        title="Contact Eyneya Business Solutions | Tax Advisor in Kennesaw, GA"
        description="Contact Eyneya Business Solutions for tax preparation, planning, advisory, and strategy services. Based in Kennesaw, GA — serving Metro Atlanta and clients nationwide."
        path="/contact"
      />
      <PageHero
        eyebrow="Contact"
        title="Get in Touch With Eyneya Business Solutions"
        subtitle="Have a question or ready to get started? Send us a message and we will respond within one business day."
      />

      <Section bg="white">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="card card-pad text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-brand-success">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h2 className="mt-4 text-2xl font-bold">Message Received</h2>
                <p className="mt-2 text-brand-slate">
                  Thank you for reaching out. We have received your message and will respond within one business day.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/book" className="btn-purple">
                    Book an Appointment
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button onClick={() => setSubmitted(false)} className="btn-outline">
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="card card-pad space-y-5">
                <h2 className="text-xl font-bold">Send Us a Message</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="full_name">Full Name *</label>
                    <input id="full_name" className="input" {...register('full_name')} placeholder="Jane Doe" />
                    {errors.full_name && <p className="mt-1 text-sm text-brand-error">{errors.full_name.message}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="email">Email *</label>
                    <input id="email" type="email" className="input" {...register('email')} placeholder="jane@example.com" />
                    {errors.email && <p className="mt-1 text-sm text-brand-error">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="phone">Phone</label>
                    <input id="phone" className="input" {...register('phone')} placeholder="(770) 555-0142" />
                  </div>
                  <div>
                    <label className="label" htmlFor="service_interest">Service Interest</label>
                    <select id="service_interest" className="input" {...register('service_interest')}>
                      <option value="">Select a service...</option>
                      <option>Tax Preparation</option>
                      <option>Self-Employed Tax Preparation</option>
                      <option>Business Tax Preparation</option>
                      <option>Tax Advisory</option>
                      <option>Tax Planning</option>
                      <option>Tax Strategy</option>
                      <option>Tax Amendments</option>
                      <option>Tax Compliance</option>
                      <option>Ongoing Tax Advisory</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="message">Message *</label>
                  <textarea id="message" rows={5} className="input" {...register('message')} placeholder="Tell us about your tax situation or question..." />
                  {errors.message && <p className="mt-1 text-sm text-brand-error">{errors.message.message}</p>}
                </div>

                {submitError && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-brand-error">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-brand-slate">
                    By submitting, you agree to be contacted about your inquiry. We respect your privacy.
                  </p>
                  <button type="submit" disabled={isSubmitting} className="btn-purple">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Business info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card card-pad">
              <h3 className="font-bold text-brand-dark">Contact Information</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href={`tel:${BUSINESS.phone.replace(/[^\d]/g, '')}`} className="flex items-center gap-3 text-brand-slate hover:text-brand-purple transition-colors">
                    <Phone className="h-5 w-5 text-brand-purple" />
                    {BUSINESS.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-3 text-brand-slate hover:text-brand-purple transition-colors">
                    <Mail className="h-5 w-5 text-brand-purple" />
                    {BUSINESS.email}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-brand-slate">
                  <MapPin className="h-5 w-5 text-brand-purple" />
                  {BUSINESS.city}, {BUSINESS.state}
                </li>
              </ul>
            </div>

            <div className="card card-pad">
              <h3 className="font-bold text-brand-dark flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand-purple" />
                Hours of Operation
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {BUSINESS.hours.map((h) => (
                  <li key={h.day} className="flex justify-between">
                    <span className="text-brand-slate">{h.day}</span>
                    <span className="font-medium text-brand-dark">{h.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card card-pad bg-brand-purple-light border-brand-purple/20">
              <h3 className="font-bold text-brand-dark">Prefer to Book Directly?</h3>
              <p className="mt-2 text-sm text-brand-slate">Skip the back-and-forth and grab a time on our calendar.</p>
              <Link to="/book" className="btn-gold w-full mt-4">
                Book Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section bg="offwhite">
        <FaqAccordion items={FAQS} />
      </Section>
    </>
  );
}
