import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import ServicePricing from '../components/ServicePricing';
import FaqAccordion, { type FaqItem } from '../components/ui/FaqAccordion';
import { CtaBanner } from '../components/ui/PricingCard';
import { useService } from '../lib/useService';
import { BUSINESS } from '../lib/constants';

const FAQS: FaqItem[] = [
  { q: 'How far back can I amend a tax return?', a: 'The IRS generally allows amendments within 3 years of the original filing deadline or within 2 years of when you paid taxes owed — whichever is later. If you have returns that may need correction beyond that window, contact us and we will review your specific situation.' },
  { q: 'Will amending my return trigger an audit?', a: 'Amending a return does not automatically trigger an audit. The IRS processes amended returns separately. Filing an accurate amendment is always preferable to leaving an error uncorrected.' },
  { q: 'I forgot to report a 1099 — what should I do?', a: 'This is one of the most common amendment situations. Unreported 1099 income can trigger an IRS notice because the IRS receives copies of your 1099s directly from payers. We can file an amendment to correct the return and minimize potential penalties.' },
  { q: 'Can you amend a return prepared by someone else?', a: 'Yes. We regularly amend returns originally prepared by another tax professional, tax software, or the client themselves. You do not need to have used Eyneya for the original return.' },
  { q: 'How long does an amendment take?', a: 'We prepare the amendment within 3–7 business days of receiving your documents. After filing, the IRS currently takes 16–20 weeks to process Form 1040-X. State amendments vary by state.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function TaxAmendmentsPage() {
  const { service, loading, error } = useService('tax-amendments');

  return (
    <>
      <Seo
        title="Amended Tax Return Help | Fix a Tax Return Mistake — Kennesaw, GA"
        description="Need to amend a tax return? We help individuals and business owners correct errors, report missing income, fix deductions, and file Form 1040-X. Starting at $99."
        path="/tax-amendments"
        schema={faqSchema}
      />
      <PageHero
        eyebrow="Tax Amendments"
        title="Amended Tax Return Help for Tax Filing Mistakes, Missed Forms, and Corrections"
        subtitle="Need to correct or update a tax return that was already filed? We help clients amend returns when income, deductions, credits, dependents, or filing details need to be corrected."
        cta={{ label: 'Amend My Return', to: '/book' }}
        showCallCta
        phone={BUSINESS.phone}
      />

      <Section bg="white">
        <SectionHeader eyebrow="Pricing" title="Amendment Tiers" center />
        <div className="mt-10">
          {loading && <div className="grid gap-6 sm:grid-cols-3"><div className="h-72 shimmer-bg rounded-xl" /><div className="h-72 shimmer-bg rounded-xl" /><div className="h-72 shimmer-bg rounded-xl" /></div>}
          {error && <p className="text-center text-brand-error">{error}</p>}
          {service && <ServicePricing service={service} ctaLabel="Amend My Return" />}
        </div>
      </Section>

      <Section bg="offwhite">
        <FaqAccordion items={FAQS} />
      </Section>

      <Section bg="white">
        <CtaBanner
          title="Need to Correct a Tax Return?"
          subtitle="Book an amendment appointment online today."
          primary={{ label: 'Amend My Return', to: '/book' }}
          secondary={{ label: 'Ask a Question', to: '/contact' }}
        />
      </Section>
    </>
  );
}
