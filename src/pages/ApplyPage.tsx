import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { Section } from '../components/ui/Section';
import { supabase } from '../lib/supabase';
import { CtaBanner } from '../components/ui/PricingCard';

const PLAN_INFO: Record<string, { name: string; price: string }> = {
  'tax-clarity': { name: 'Tax Clarity Plan', price: 'Starting at $497 per quarter' },
  'business-plan': { name: 'Tax-Ready Business Plan', price: 'Starting at $497–$750/month' },
  strategic: { name: 'Strategic Tax Advisory Plan', price: 'Starting at $997–$1,500+/month' },
};

const schema = z.object({
  full_name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(7, 'Please enter a phone number'),
  business_name: z.string().optional(),
  business_type: z.string().min(1, 'Please select a business type'),
  annual_revenue: z.string().min(1, 'Please select a range'),
  current_situation: z.string().min(1, 'Please select one'),
  biggest_challenge: z.string().min(10, 'Please describe your biggest challenge'),
  plan: z.string(),
  referral: z.string().optional(),
  agree_timeline: z.boolean().refine((v) => v, 'You must agree to the response timeline'),
});

type FormData = z.infer<typeof schema>;

export default function ApplyPage() {
  const { plan } = useParams();
  const planInfo = PLAN_INFO[plan ?? ''] ?? PLAN_INFO['tax-clarity'];
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { plan: planInfo.name },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    // Store as a contact submission with advisory application context
    const { error } = await supabase.from('contact_submissions').insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      service_interest: `Ongoing Advisory Application — ${data.plan}`,
      message: JSON.stringify({
        business_name: data.business_name,
        business_type: data.business_type,
        annual_revenue: data.annual_revenue,
        current_situation: data.current_situation,
        biggest_challenge: data.biggest_challenge,
        referral: data.referral,
      }),
      source_page: `apply/${plan}`,
      status: 'new',
    });
    if (error) {
      setSubmitError('Something went wrong submitting your application. Please try again.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <Seo title="Application Received | Eyneya Business Solutions" description="Your application has been received." path={`/apply/${plan}`} />
        <Section bg="white" className="min-h-[60vh] flex items-center">
          <div className="max-w-xl mx-auto text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-brand-success">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h1 className="mt-5 text-3xl font-bold">Application Received</h1>
            <p className="mt-3 text-brand-slate">
              Thank you for applying for the <strong className="text-brand-dark">{planInfo.name}</strong>. We have received your application and will review it within 2 business days. You will receive an email confirmation shortly.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/" className="btn-outline">Return Home</Link>
              <Link to="/ongoing-advisory" className="btn-purple">View Other Plans</Link>
            </div>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <Seo
        title={`Apply for ${planInfo.name} | Eyneya Business Solutions`}
        description="Apply for an Ongoing Tax Advisory plan. Year-round tax planning, compliance, and strategy support."
        path={`/apply/${plan}`}
      />
      <PageHero
        eyebrow="Ongoing Advisory Application"
        title={`Apply for the ${planInfo.name}`}
        subtitle={planInfo.price}
      />

      <Section bg="white">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="card card-pad space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
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
                <label className="label">Phone *</label>
                <input className="input" {...register('phone')} placeholder="(770) 555-0142" />
                {errors.phone && <p className="mt-1 text-sm text-brand-error">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="label">Business Name (optional)</label>
                <input className="input" {...register('business_name')} placeholder="Doe Consulting LLC" />
              </div>
              <div>
                <label className="label">Business Type *</label>
                <select className="input" {...register('business_type')}>
                  <option value="">Select...</option>
                  <option>Individual / W-2 earner</option>
                  <option>Sole Proprietor / Freelancer</option>
                  <option>Single-Member LLC</option>
                  <option>Multi-Member LLC / Partnership</option>
                  <option>S Corporation</option>
                  <option>C Corporation</option>
                  <option>Nonprofit</option>
                  <option>Other</option>
                </select>
                {errors.business_type && <p className="mt-1 text-sm text-brand-error">{errors.business_type.message}</p>}
              </div>
              <div>
                <label className="label">Annual Revenue Range *</label>
                <select className="input" {...register('annual_revenue')}>
                  <option value="">Select...</option>
                  <option>Under $50,000</option>
                  <option>$50,000 – $100,000</option>
                  <option>$100,000 – $250,000</option>
                  <option>$250,000 – $500,000</option>
                  <option>$500,000 – $1,000,000</option>
                  <option>$1,000,000+</option>
                </select>
                {errors.annual_revenue && <p className="mt-1 text-sm text-brand-error">{errors.annual_revenue.message}</p>}
              </div>
              <div>
                <label className="label">Current Tax Situation *</label>
                <select className="input" {...register('current_situation')}>
                  <option value="">Select...</option>
                  <option>Individual</option>
                  <option>Self-Employed</option>
                  <option>Business Owner</option>
                  <option>Both (W-2 + Business)</option>
                </select>
                {errors.current_situation && <p className="mt-1 text-sm text-brand-error">{errors.current_situation.message}</p>}
              </div>
              <div>
                <label className="label">How did you hear about us?</label>
                <select className="input" {...register('referral')}>
                  <option value="">Select...</option>
                  <option>Google search</option>
                  <option>Referral from a friend/colleague</option>
                  <option>Social media</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Biggest Tax Challenge *</label>
              <textarea rows={4} className="input" {...register('biggest_challenge')} placeholder="Tell us about your biggest tax challenge or what you hope to get from ongoing advisory..." />
              {errors.biggest_challenge && <p className="mt-1 text-sm text-brand-error">{errors.biggest_challenge.message}</p>}
            </div>

            <div>
              <label className="label">Plan of Interest</label>
              <input className="input bg-gray-50" readOnly {...register('plan')} />
            </div>

            <label className="flex items-start gap-2.5 text-sm text-brand-dark">
              <input type="checkbox" className="mt-1 rounded border-gray-300 text-brand-purple focus:ring-brand-purple" {...register('agree_timeline')} />
              <span>I understand Eyneya will review my application and respond within 2 business days.</span>
            </label>
            {errors.agree_timeline && <p className="text-sm text-brand-error">{errors.agree_timeline.message}</p>}

            {submitError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-brand-error">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-purple w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </Section>

      <Section bg="offwhite">
        <CtaBanner
          title="Not Sure Which Plan Is Right?"
          subtitle="Send us a message and we will help you choose."
          primary={{ label: 'Contact Us', to: '/contact' }}
          secondary={{ label: 'View All Plans', to: '/ongoing-advisory' }}
        />
      </Section>
    </>
  );
}
