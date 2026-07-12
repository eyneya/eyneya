import { CreditCard, Receipt, Calculator, Smartphone, Percent } from 'lucide-react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import ServicePricing from '../components/ServicePricing';
import FaqAccordion, { type FaqItem } from '../components/ui/FaqAccordion';
import { CtaBanner } from '../components/ui/PricingCard';
import { useService } from '../lib/useService';

const PROBLEMS = [
  { icon: CreditCard, title: '1099s from multiple clients', desc: 'We consolidate all income sources and ensure nothing is missed.' },
  { icon: Receipt, title: 'Business deductions you may be missing', desc: 'Home office, vehicle mileage, equipment, software, and professional development.' },
  { icon: Calculator, title: 'Estimated tax payments', desc: 'We calculate what you owe quarterly so you are never surprised in April.' },
  { icon: Smartphone, title: 'Payment app income (Venmo, Cash App, PayPal)', desc: 'We properly report 1099-K and app income so your return is accurate.' },
  { icon: Percent, title: 'Self-employment tax', desc: 'We identify all available deductions to reduce your SE tax liability.' },
];

const FAQS: FaqItem[] = [
  { q: 'What is Schedule C and do I need it?', a: 'Schedule C (Profit or Loss from Business) is the tax form used to report self-employment income and expenses. If you received 1099-NEC income, run a sole proprietorship, or have freelance income, you likely need a Schedule C. Our self-employed tax preparation service includes Schedule C preparation.' },
  { q: 'I use a payment app like Venmo or Cash App for business — do I owe taxes on that?', a: 'Yes. Business payments received through third-party payment apps are taxable income. As of 2023, payment processors are required to issue 1099-K forms for business transactions over $600. We will ensure all app-based income is properly reported.' },
  { q: 'Can you help me figure out my quarterly estimated tax payments?', a: 'Yes. Estimated tax planning is included as part of your return preparation. We calculate what you should be paying each quarter to avoid penalties and help set you up for next year.' },
  { q: 'What business deductions can I take?', a: 'Common self-employment deductions include home office expenses, vehicle mileage, business equipment, software subscriptions, professional development, business meals (50%), health insurance premiums, and retirement contributions. We will review your situation and identify all allowable deductions.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function SelfEmployedTaxPreparationPage() {
  const { service, loading, error } = useService('self-employed-tax-preparation');

  return (
    <>
      <Seo
        title="Tax Preparation for Self-Employed & 1099 Workers | Kennesaw, GA"
        description="Tax preparation for freelancers, gig workers, 1099 earners, and self-employed professionals. Includes Schedule C, estimated taxes, and business deductions. Starting at $499."
        path="/self-employed-tax-preparation"
        schema={faqSchema}
      />
      <PageHero
        eyebrow="Self-Employed Tax Preparation"
        title="Tax Preparation for Self-Employed Professionals, Freelancers, Gig Workers, and 1099 Earners"
        subtitle="We help self-employed clients organize income, review deductions, understand estimated taxes, and file with more confidence."
        cta={{ label: 'File My Self-Employed Taxes', to: '/book' }}
      />

      <Section bg="white">
        <SectionHeader eyebrow="Pricing" title="Self-Employed Tax Preparation" center />
        <div className="mt-10">
          {loading && <div className="max-w-xl mx-auto h-72 shimmer-bg rounded-xl" />}
          {error && <p className="text-center text-brand-error">{error}</p>}
          {service && <ServicePricing service={service} ctaLabel="File My Self-Employed Taxes" />}
        </div>
      </Section>

      <Section bg="offwhite">
        <SectionHeader eyebrow="What We Handle" title="Self-Employed Tax Challenges We Solve" center />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="card card-pad flex items-start gap-4">
              <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-brand-purple-light text-brand-purple">
                <p.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-brand-dark">{p.title}</h3>
                <p className="mt-1 text-sm text-brand-slate leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="white">
        <FaqAccordion items={FAQS} />
      </Section>

      <Section bg="offwhite">
        <CtaBanner
          title="File Your Self-Employed Taxes With Confidence"
          subtitle="Book online and get organized, accurate tax preparation."
          primary={{ label: 'File My Self-Employed Taxes', to: '/book' }}
          secondary={{ label: 'Ask a Question', to: '/contact' }}
        />
      </Section>
    </>
  );
}
