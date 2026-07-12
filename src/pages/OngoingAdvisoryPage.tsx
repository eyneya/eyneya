import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Crown, Layers } from 'lucide-react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import FaqAccordion, { type FaqItem } from '../components/ui/FaqAccordion';
import { CtaBanner, PricingDisclaimer } from '../components/ui/PricingCard';
import { useService } from '../lib/useService';
import { cn } from '../lib/utils';

interface Plan {
  name: string;
  bestFor: string;
  includes: string[];
  price: string;
  applySlug: string;
  badge?: string;
  icon: typeof Sparkles;
  highlighted?: boolean;
}

export default function OngoingAdvisoryPage() {
  const { service } = useService('ongoing-advisory');
  const tiers = service?.service_tiers ?? [];

  const planMap: Record<string, Plan> = {
    'Tax Clarity Plan': {
      name: 'Tax Clarity Plan',
      bestFor: 'Individuals and self-employed clients who need quarterly guidance and tax planning.',
      includes: ['Quarterly tax check-in', 'Income and deduction review', 'Estimated tax payment guidance', 'Tax document checklist', 'Quarterly action summary'],
      price: 'Starting at $497 per quarter',
      applySlug: 'tax-clarity',
      icon: Sparkles,
    },
    'Tax-Ready Business Plan': {
      name: 'Tax-Ready Business Plan',
      bestFor: 'Business owners who need quarterly tax planning, compliance review, and preparation support.',
      includes: ['Quarterly business tax review', 'Income and expense review', 'Estimated tax planning', 'Contractor documentation review', 'Tax readiness checklist', 'Compliance gap summary'],
      price: 'Starting at $497–$750/month',
      applySlug: 'business-plan',
      icon: Layers,
    },
    'Strategic Tax Advisory Plan': {
      name: 'Strategic Tax Advisory Plan',
      bestFor: 'Serious business owners who need ongoing tax planning, tax strategy, compliance guidance, and year-round advisory support.',
      includes: ['Monthly or quarterly advisory support', 'Tax strategy review', 'Entity structure review', 'S-Corp and compensation planning guidance', 'Contractor and compliance review', 'Year-end tax planning', 'Written strategy summaries'],
      price: 'Starting at $997–$1,500+/month',
      applySlug: 'strategic',
      badge: 'Most Comprehensive',
      icon: Crown,
      highlighted: true,
    },
  };

  const plans = tiers.map((t) => planMap[t.name]).filter(Boolean);

  const FAQS: FaqItem[] = [
    { q: 'Is this a contract or can I cancel anytime?', a: 'Ongoing Advisory plans are month-to-month and can be cancelled with 30 days written notice. There are no long-term commitments.' },
    { q: 'What is the difference between the Business Plan and the Strategic Plan?', a: 'The Tax-Ready Business Plan focuses on quarterly compliance, bookkeeping readiness, and estimated taxes. The Strategic Plan adds deeper advisory — entity strategy, compensation planning, long-term tax positioning, and more frequent advisory touchpoints.' },
    { q: 'Do Ongoing Advisory plans include tax return preparation?', a: 'Return preparation is available as an add-on to any advisory plan at a discounted rate for plan members. The advisory plans themselves focus on planning, strategy, and compliance — not the actual preparation and filing of returns (though preparation is available to all advisory clients).' },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <Seo
        title="Ongoing Tax Advisory | Quarterly Tax Planning & Year-Round Tax Support — Kennesaw, GA"
        description="Year-round tax planning, compliance, and strategy support for individuals, self-employed professionals, and business owners. Quarterly and monthly advisory plans available."
        path="/ongoing-advisory"
        schema={faqSchema}
      />
      <PageHero
        eyebrow="Ongoing Tax Advisory"
        title="Ongoing Tax Advisory for Clients Who Want Year-Round Tax Guidance"
        subtitle="Year-round tax planning, compliance, and strategy support for clients who want more than one-time tax preparation."
      />

      <Section bg="white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-brand-slate leading-relaxed">
            Our Ongoing Tax Advisory plans are designed for individuals, self-employed professionals, and business owners who want consistent tax guidance throughout the year. These plans help clients plan ahead, stay compliant, avoid surprise tax bills, and make smarter financial decisions.
          </p>
        </div>
      </Section>

      {/* Plan Cards */}
      <Section bg="offwhite">
        <SectionHeader eyebrow="Plans" title="Choose Your Ongoing Advisory Plan" center />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'card card-pad flex flex-col relative transition-all',
                plan.highlighted && 'ring-2 ring-brand-purple shadow-premium lg:-translate-y-2',
              )}
            >
              {plan.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-gold shadow-sm">{plan.badge}</span>}
              <span className={cn('grid h-12 w-12 place-items-center rounded-lg', plan.highlighted ? 'bg-brand-purple text-white' : 'bg-brand-purple-light text-brand-purple')}>
                <plan.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-brand-dark">{plan.name}</h3>
              <p className="mt-4 text-2xl font-bold text-brand-purple font-serif">{plan.price}</p>
              <p className="mt-3 text-sm text-brand-slate leading-relaxed">
                <span className="font-semibold text-brand-dark">Best for:</span> {plan.bestFor}
              </p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-brand-purple">Includes</p>
              <ul className="mt-3 space-y-2 flex-1">
                {plan.includes.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-brand-slate">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-brand-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to={`/apply/${plan.applySlug}`} className={cn('mt-6', plan.highlighted ? 'btn-purple' : 'btn-outline')}>
                {plan.name.includes('Strategic') ? 'Apply for Strategic Advisory' : plan.name.includes('Business') ? 'Start Business Tax Advisory' : 'Start Tax Clarity Plan'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
        <PricingDisclaimer />
      </Section>

      <Section bg="white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold">How the Application Works</h2>
          <div className="mt-6 space-y-4 text-left">
            {[
              { step: 1, title: 'Submit your application', desc: 'Tell us about your business, revenue, and biggest tax challenge.' },
              { step: 2, title: 'We review within 2 business days', desc: 'Our team reviews your situation and reaches out to discuss fit.' },
              { step: 3, title: 'Start your plan', desc: 'Onboarding and your first advisory touchpoint scheduled.' },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4 rounded-lg border border-gray-100 p-4">
                <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-brand-purple text-sm font-bold text-white">{s.step}</span>
                <div>
                  <p className="font-semibold text-brand-dark">{s.title}</p>
                  <p className="text-sm text-brand-slate mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section bg="offwhite">
        <FaqAccordion items={FAQS} />
      </Section>

      <Section bg="white">
        <CtaBanner
          title="Ready for Year-Round Tax Support?"
          subtitle="Apply for an Ongoing Advisory plan today."
          primary={{ label: 'View Plans & Apply', to: '#plans' }}
          secondary={{ label: 'Contact Us', to: '/contact' }}
        />
      </Section>
    </>
  );
}
