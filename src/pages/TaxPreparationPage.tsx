import { ListChecks, ArrowRight, Upload, FileCheck2 } from 'lucide-react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import ServicePricing from '../components/ServicePricing';
import FaqAccordion, { type FaqItem } from '../components/ui/FaqAccordion';
import AddOnServices from '../components/AddOnServices';
import { CtaBanner } from '../components/ui/PricingCard';
import { useService } from '../lib/useService';

const STEPS = [
  { icon: ListChecks, title: 'Select your tax return type', desc: 'Choose the tier that matches your tax situation above.' },
  { icon: ArrowRight, title: 'Book your tax preparation appointment', desc: 'Pick a date and time from our online calendar.' },
  { icon: Upload, title: 'Upload your documents through our secure intake', desc: 'We send a document checklist when you book.' },
  { icon: FileCheck2, title: 'Receive your completed return with a summary of your results', desc: 'Review, approve, and we file electronically.' },
];

const FAQS: FaqItem[] = [
  { q: 'How long does tax preparation take?', a: 'Most individual returns are completed within 3–7 business days after we receive all required documents. Complex returns or returns with missing documents may take longer. We will keep you updated throughout the process.' },
  { q: 'What documents do I need to provide?', a: 'Common documents include W-2s, 1099s, Social Security statements, mortgage interest statements (Form 1098), student loan interest, childcare expenses, charitable contribution receipts, prior-year tax return, and any IRS or state notices received. We will send you a document checklist when you book.' },
  { q: 'Do you prepare taxes for clients outside Georgia?', a: 'Yes. We prepare taxes for clients in all 50 states. Our process is fully virtual — you submit documents securely online and we handle the rest.' },
  { q: 'Can you file my taxes if I had income in multiple states?', a: 'Yes. Multi-state tax situations are included in our Enhanced and Complex tiers. Please note your state situation when booking so we can confirm the appropriate tier.' },
  { q: 'What is the difference between Simple, Enhanced, and Complex?', a: 'Simple covers straightforward W-2 returns with standard deductions. Enhanced adds complexity like 1099s, itemized deductions, or education credits. Complex covers self-employment, business income, investments, rental properties, or crypto. If you are unsure, book a Tax Clarity Session and we will help you determine the right tier.' },
  { q: 'What happens after I submit my documents?', a: 'We review your documents, prepare your return, and send you a draft for review. Once you approve, we file electronically. You receive a copy of the filed return and a summary of your results.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function TaxPreparationPage() {
  const { service, loading, error } = useService('tax-preparation');

  return (
    <>
      <Seo
        title="Tax Preparation Services in Kennesaw, GA | Eyneya Business Solutions"
        description="Professional tax preparation services for individuals, self-employed professionals, and business owners in Kennesaw, Marietta, and Metro Atlanta. Starting at $225."
        path="/tax-preparation"
        schema={faqSchema}
      />
      <PageHero
        eyebrow="Tax Preparation"
        title="Professional Tax Preparation Services for Individuals, Self-Employed Professionals, and Business Owners"
        subtitle="Get accurate, organized, and professional tax preparation support based on the complexity of your tax situation. Serving Kennesaw, Marietta, Metro Atlanta, and clients nationwide."
        cta={{ label: 'Start Tax Preparation', to: '/book' }}
      />

      {/* Pricing */}
      <Section bg="white">
        <SectionHeader eyebrow="Pricing" title="Choose Your Tax Return Type" center />
        <div className="mt-10">
          {loading && <PricingSkeleton />}
          {error && <p className="text-center text-brand-error">{error}</p>}
          {service && <ServicePricing service={service} ctaLabel="Start Tax Preparation" />}
        </div>
      </Section>

      {/* How it works */}
      <Section bg="offwhite">
        <SectionHeader eyebrow="How It Works" title="4 Simple Steps" center />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={i} className="card card-pad text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-purple-light text-brand-purple">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-bold text-brand-dark text-sm">{s.title}</h3>
              <p className="mt-1.5 text-xs text-brand-slate leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <AddOnServices />

      <Section bg="white">
        <FaqAccordion items={FAQS} />
      </Section>

      <Section bg="offwhite">
        <CtaBanner
          title="Ready to File Your Taxes?"
          subtitle="Book your tax preparation appointment online in minutes."
          primary={{ label: 'Start Tax Preparation', to: '/book' }}
          secondary={{ label: 'Ask a Question', to: '/contact' }}
        />
      </Section>
    </>
  );
}

function PricingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card card-pad h-72 shimmer-bg rounded-xl" />
      ))}
    </div>
  );
}
