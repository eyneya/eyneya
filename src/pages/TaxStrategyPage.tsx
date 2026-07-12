import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import ServicePricing from '../components/ServicePricing';
import FaqAccordion, { type FaqItem } from '../components/ui/FaqAccordion';
import { CtaBanner } from '../components/ui/PricingCard';
import { useService } from '../lib/useService';
import { BUSINESS } from '../lib/constants';

const FAQS: FaqItem[] = [
  { q: 'What is an S-Corp election and could it save me money?', a: 'An S-Corporation election is a tax classification that can reduce self-employment taxes for qualifying business owners. Instead of paying SE tax on all business profits, you pay yourself a reasonable salary and take remaining profits as a distribution — which is not subject to SE tax. For business owners generating $75,000+ in net profit, an S-Corp election can save $5,000–$20,000+ per year depending on income. Our S-Corp Election Analysis walks through the math for your specific situation.' },
  { q: 'When does entity structure actually matter for taxes?', a: 'Entity structure affects how your income is taxed, what deductions you can take, how you pay yourself, and your exposure to self-employment tax. The right structure depends on your income level, type of business, and long-term goals. A sole proprietor earning $50K pays taxes very differently than an S-Corp owner earning $50K.' },
  { q: 'How is a Tax Strategy session different from Tax Planning?', a: 'Tax planning is typically focused on the current tax year — estimating what you owe and identifying near-term deductions. Tax strategy goes deeper — reviewing your entity structure, long-term compensation strategy, multi-year income projections, and systemic opportunities that compound over time.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function TaxStrategyPage() {
  const { service, loading, error } = useService('tax-strategy');

  return (
    <>
      <Seo
        title="Business Tax Strategy | LLC & S-Corp Tax Strategy — Kennesaw, GA"
        description="Tax strategy services for business owners and high-income earners in Kennesaw, Marietta, and Metro Atlanta. Entity analysis, S-Corp election, and multi-income planning. From $497."
        path="/tax-strategy"
        schema={faqSchema}
      />
      <PageHero
        eyebrow="Tax Strategy"
        title="Tax Strategy for Business Owners, High-Income Earners, and Clients With Complex Tax Situations"
        subtitle="For clients who need a smarter long-term tax approach involving entity structure, S-Corp analysis, multiple income streams, deductions, and business growth."
        cta={{ label: 'Build My Tax Strategy', to: '/book' }}
        showCallCta
        phone={BUSINESS.phone}
      />

      <Section bg="white">
        <SectionHeader eyebrow="Pricing" title="Tax Strategy Sessions" center />
        <div className="mt-10">
          {loading && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><div className="h-72 shimmer-bg rounded-xl" /><div className="h-72 shimmer-bg rounded-xl" /><div className="h-72 shimmer-bg rounded-xl" /><div className="h-72 shimmer-bg rounded-xl" /></div>}
          {error && <p className="text-center text-brand-error">{error}</p>}
          {service && <ServicePricing service={service} ctaLabel="Build My Tax Strategy" />}
        </div>
      </Section>

      <Section bg="offwhite">
        <FaqAccordion items={FAQS} />
      </Section>

      <Section bg="white">
        <CtaBanner
          title="Build a Smarter Long-Term Tax Strategy"
          subtitle="Book a tax strategy session tailored to your business and income."
          primary={{ label: 'Build My Tax Strategy', to: '/book' }}
          secondary={{ label: 'Explore Ongoing Advisory', to: '/ongoing-advisory' }}
        />
      </Section>
    </>
  );
}
