import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import ServicePricing from '../components/ServicePricing';
import FaqAccordion, { type FaqItem } from '../components/ui/FaqAccordion';
import AddOnServices from '../components/AddOnServices';
import { CtaBanner, PricingDisclaimer } from '../components/ui/PricingCard';
import { useService } from '../lib/useService';

const PRIOR_YEAR = [
  { name: 'Single Prior-Year Return', price: 'Starting at $275', cta: 'File Prior-Year Taxes', to: '/book' },
  { name: 'Self-Employed Prior-Year Return', price: 'Starting at $575', cta: 'File Prior-Year Taxes', to: '/book' },
  { name: 'Multi-Year Catch-Up Package', price: 'Custom quote, starting at $750', cta: 'Get Caught Up', to: '/book' },
];

const FAQS: FaqItem[] = [
  { q: 'I received an IRS notice — what should I do?', a: 'Do not ignore it. Most IRS notices are informational or request clarification — they are not always audit notices. Book an IRS Notice Review and we will explain exactly what the notice means, whether any action is required, and what your next steps are.' },
  { q: 'I have not filed taxes in several years — where do I start?', a: 'The first step is understanding which years are outstanding and whether you owe money or may be due a refund. We help clients catch up on prior-year filings in an organized, step-by-step process. The IRS can assess penalties for late filing, but addressing it proactively is always better than waiting.' },
  { q: 'I paid contractors last year — do I need to file 1099s?', a: 'Generally, yes. If you paid a contractor $600 or more during the tax year, you are typically required to issue a Form 1099-NEC. Failure to do so can result in penalties. Our Contractor Tax Compliance Review helps you determine your 1099 obligations and get properly set up.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function TaxCompliancePage() {
  const { service, loading, error } = useService('tax-compliance');

  return (
    <>
      <Seo
        title="Tax Compliance Support | IRS Notice Help & Business Tax Compliance — Kennesaw, GA"
        description="Tax compliance support for IRS notices, prior-year filings, estimated taxes, and business tax readiness in Kennesaw, Marietta, and Metro Atlanta. From $150."
        path="/tax-compliance"
        schema={faqSchema}
      />
      <PageHero
        eyebrow="Tax Compliance"
        title="Tax Compliance Support for Notices, Prior-Year Filings, Estimated Taxes, and Business Tax Readiness"
        subtitle="For clients who need help getting current, staying compliant, reviewing notices, or identifying tax-related gaps."
        cta={{ label: 'Review My Compliance', to: '/book' }}
      />

      <Section bg="white">
        <SectionHeader eyebrow="Pricing" title="Compliance Services" center />
        <div className="mt-10">
          {loading && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><div className="h-72 shimmer-bg rounded-xl" /><div className="h-72 shimmer-bg rounded-xl" /><div className="h-72 shimmer-bg rounded-xl" /></div>}
          {error && <p className="text-center text-brand-error">{error}</p>}
          {service && <ServicePricing service={service} ctaLabel="Get Compliance Help" />}
        </div>
      </Section>

      {/* Prior-Year Filing Section */}
      <Section id="prior-year" bg="offwhite">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Clock className="h-6 w-6 text-brand-purple" />
          <h2 className="text-3xl sm:text-4xl font-bold text-center">Behind on Taxes? We Can Help You Catch Up.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PRIOR_YEAR.map((p) => (
            <div key={p.name} className="card card-pad flex flex-col">
              <h3 className="text-lg font-bold text-brand-dark">{p.name}</h3>
              <p className="mt-3 text-2xl font-bold text-brand-purple font-serif">{p.price}</p>
              <Link to={p.to} className="btn-outline mt-6">
                {p.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
        <PricingDisclaimer />
      </Section>

      <AddOnServices />

      <Section bg="white">
        <FaqAccordion items={FAQS} />
      </Section>

      <Section bg="offwhite">
        <CtaBanner
          title="Get Current. Stay Compliant."
          subtitle="Book a compliance appointment online today."
          primary={{ label: 'Check My Tax Compliance', to: '/book' }}
          secondary={{ label: 'Contact Us', to: '/contact' }}
        />
      </Section>
    </>
  );
}
