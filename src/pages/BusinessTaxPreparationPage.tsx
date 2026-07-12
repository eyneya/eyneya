import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import ServicePricing from '../components/ServicePricing';
import FaqAccordion, { type FaqItem } from '../components/ui/FaqAccordion';
import { CtaBanner } from '../components/ui/PricingCard';
import { useService } from '../lib/useService';

const FAQS: FaqItem[] = [
  { q: 'What forms are included in a business tax return?', a: 'S-Corp clients receive Form 1120-S plus K-1s for each shareholder. Partnerships receive Form 1065 plus K-1s for each partner. C-Corp clients receive Form 1120. We will confirm what is needed for your specific entity type.' },
  { q: 'Do I also need to file a personal tax return?', a: 'Most S-Corp and partnership owners receive K-1s that must be reported on their personal return. We can prepare both your business and personal returns — please mention this when booking so we can scope the engagement correctly.' },
  { q: 'My business is new and I am not sure what I owe — can you help?', a: 'Absolutely. New business owners often need both preparation and advisory support. We recommend booking a Business Tax Advisory Session first to understand your obligations before filing.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function BusinessTaxPreparationPage() {
  const { service, loading, error } = useService('business-tax-preparation');

  return (
    <>
      <Seo
        title="Business Tax Preparation Services | S-Corp, LLC & Partnership Tax Filing — Kennesaw, GA"
        description="Professional business tax preparation for S corporations, partnerships, C corporations, LLCs, and nonprofits in Kennesaw, Marietta, and Metro Atlanta. Starting at $899."
        path="/business-tax-preparation"
        schema={faqSchema}
      />
      <PageHero
        eyebrow="Business Tax Preparation"
        title="Business Tax Preparation Services for Small Businesses and Growing Companies"
        subtitle="Professional tax preparation for business entities, small business owners, and organizations that need accurate and organized filing support."
        cta={{ label: 'File My Business Taxes', to: '/book' }}
      />

      <Section bg="white">
        <SectionHeader eyebrow="Pricing" title="Business Tax Preparation Options" center />
        <div className="mt-10">
          {loading && <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto"><div className="h-72 shimmer-bg rounded-xl" /><div className="h-72 shimmer-bg rounded-xl" /></div>}
          {error && <p className="text-center text-brand-error">{error}</p>}
          {service && <ServicePricing service={service} ctaLabel="File My Business Taxes" />}
        </div>
      </Section>

      <Section bg="offwhite">
        <FaqAccordion items={FAQS} />
      </Section>

      <Section bg="white">
        <CtaBanner
          title="Get Your Business Taxes Filed Right"
          subtitle="Book your business tax preparation appointment online."
          primary={{ label: 'File My Business Taxes', to: '/book' }}
          secondary={{ label: 'Book Business Advisory', to: '/book?service=tax-advisory' }}
        />
      </Section>
    </>
  );
}
