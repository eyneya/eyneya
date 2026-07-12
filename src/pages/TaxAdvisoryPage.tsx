import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import ServicePricing from '../components/ServicePricing';
import FaqAccordion, { type FaqItem } from '../components/ui/FaqAccordion';
import { CtaBanner } from '../components/ui/PricingCard';
import { useService } from '../lib/useService';
import { BUSINESS } from '../lib/constants';

const FAQS: FaqItem[] = [
  { q: 'What is the difference between tax advisory and tax preparation?', a: 'Tax preparation is the act of preparing and filing your return. Tax advisory is guidance and strategy — helping you understand your tax situation, make better decisions, and plan ahead. Advisory sessions do not include the actual preparation or filing of a return.' },
  { q: 'How long is a Tax Clarity Session?', a: 'Tax Clarity Sessions are 30–45 minutes. We focus on your specific concern or question and provide clear next steps at the end of the session.' },
  { q: 'Do you provide written summaries after advisory sessions?', a: 'Yes. All advisory sessions include a brief written summary of what was discussed and the recommended next steps, delivered via email within 1 business day.' },
  { q: 'Can I ask questions about prior-year taxes in an advisory session?', a: 'Yes. Advisory sessions can cover any tax concern — current year, prior years, notices, strategy, or business structure.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function TaxAdvisoryPage() {
  const { service, loading, error } = useService('tax-advisory');

  return (
    <>
      <Seo
        title="Tax Advisory Services | Tax Advisor in Kennesaw & Marietta, GA"
        description="Professional tax advisory services for individuals and business owners in Kennesaw, Marietta, and Metro Atlanta. Ask a tax question, book a strategy session, or get document review. From $75."
        path="/tax-advisory"
        schema={faqSchema}
      />
      <PageHero
        eyebrow="Tax Advisory"
        title="Tax Advisory Services for Clients Who Need Answers, Clarity, and Direction"
        subtitle="For clients who need professional guidance before making tax, financial, or business decisions."
        cta={{ label: 'Book a Tax Advisory Session', to: '/book' }}
        showCallCta
        phone={BUSINESS.phone}
      />

      <Section bg="white">
        <SectionHeader eyebrow="Pricing" title="Advisory Options" center />
        <div className="mt-10">
          {loading && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><div className="h-72 shimmer-bg rounded-xl" /><div className="h-72 shimmer-bg rounded-xl" /><div className="h-72 shimmer-bg rounded-xl" /><div className="h-72 shimmer-bg rounded-xl" /></div>}
          {error && <p className="text-center text-brand-error">{error}</p>}
          {service && <ServicePricing service={service} ctaLabel="Book Advisory Session" />}
        </div>
      </Section>

      <Section bg="offwhite">
        <FaqAccordion items={FAQS} />
      </Section>

      <Section bg="white">
        <CtaBanner
          title="Get Clear Tax Guidance"
          subtitle="Book a tax advisory session and walk away with answers and next steps."
          primary={{ label: 'Book a Tax Advisory Session', to: '/book' }}
          secondary={{ label: 'Contact Us', to: '/contact' }}
        />
      </Section>
    </>
  );
}
