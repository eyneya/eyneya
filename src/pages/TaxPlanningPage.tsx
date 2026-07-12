import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import ServicePricing from '../components/ServicePricing';
import FaqAccordion, { type FaqItem } from '../components/ui/FaqAccordion';
import { CtaBanner } from '../components/ui/PricingCard';
import { useService } from '../lib/useService';
import { BUSINESS } from '../lib/constants';

const FAQS: FaqItem[] = [
  { q: 'What is the best time of year to do tax planning?', a: 'While year-end planning (October–December) is ideal, tax planning is valuable year-round. The earlier in the year you plan, the more options you have. Even mid-year planning can identify estimated tax adjustments and deduction opportunities before it is too late.' },
  { q: 'What is an estimated tax payment and do I need to make them?', a: 'Estimated tax payments are quarterly payments you make to the IRS (and your state) to cover income that does not have withholding — such as self-employment income, business income, investment income, or rental income. If you do not pay enough throughout the year, you may owe a penalty in addition to taxes owed. Our tax planning sessions include a review of your estimated payment obligations.' },
  { q: 'Can tax planning help me reduce what I owe?', a: 'Yes. Tax planning identifies legal opportunities to reduce your taxable income — such as maximizing retirement contributions, timing income and deductions, reviewing your entity structure, and utilizing available credits. The goal is to reduce your liability before filing season, not after.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function TaxPlanningPage() {
  const { service, loading, error } = useService('tax-planning');

  return (
    <>
      <Seo
        title="Tax Planning Services | Small Business & Self-Employed Tax Planning — Kennesaw, GA"
        description="Tax planning services for individuals, self-employed professionals, and business owners in Kennesaw, Marietta, and Metro Atlanta. Avoid surprise tax bills. From $249."
        path="/tax-planning"
        schema={faqSchema}
      />
      <PageHero
        eyebrow="Tax Planning"
        title="Tax Planning Services to Help You Avoid Surprise Tax Bills"
        subtitle="For individuals, self-employed professionals, and business owners who want to plan before tax season and understand what they may owe before it is too late."
        cta={{ label: 'Plan My Taxes', to: '/book' }}
        showCallCta
        phone={BUSINESS.phone}
      />

      <Section bg="white">
        <SectionHeader eyebrow="Pricing" title="Tax Planning Sessions" center />
        <div className="mt-10">
          {loading && <div className="grid gap-6 sm:grid-cols-3"><div className="h-72 shimmer-bg rounded-xl" /><div className="h-72 shimmer-bg rounded-xl" /><div className="h-72 shimmer-bg rounded-xl" /></div>}
          {error && <p className="text-center text-brand-error">{error}</p>}
          {service && <ServicePricing service={service} ctaLabel="Plan My Taxes" />}
        </div>
      </Section>

      <Section bg="offwhite">
        <FaqAccordion items={FAQS} />
      </Section>

      <Section bg="white">
        <CtaBanner
          title="Plan Ahead. Avoid Surprises."
          subtitle="Book a tax planning session and know what to expect before tax season."
          primary={{ label: 'Plan My Taxes', to: '/book' }}
          secondary={{ label: 'Explore Tax Strategy', to: '/tax-strategy' }}
        />
      </Section>
    </>
  );
}
