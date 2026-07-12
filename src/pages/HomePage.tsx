import { Link } from 'react-router-dom';
import {
  ArrowRight, Calendar, FileText, Briefcase, Building2, MessageCircleQuestion,
  TrendingUp, Target, PencilLine, ShieldCheck, CalendarHeart, MapPin, Globe,
  CheckCircle2, Sparkles, Star,
} from 'lucide-react';
import Seo from '../components/Seo';
import { Section, SectionHeader } from '../components/ui/Section';
import TestimonialCard from '../components/ui/TestimonialCard';
import { CtaBanner } from '../components/ui/PricingCard';
import { BUSINESS } from '../lib/constants';
import { TESTIMONIALS, TAX_PROBLEMS, SERVICE_PREVIEWS, HOW_IT_WORKS } from '../lib/content';

const ICONS: Record<string, typeof FileText> = {
  FileText, Briefcase, Building2, MessageCircleQuestion, TrendingUp, Target,
  PencilLine, ShieldCheck, CalendarHeart,
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Do you work with clients outside Georgia?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We serve clients virtually in all 50 states.' } },
    { '@type': 'Question', name: 'How do I book an appointment?', acceptedAnswer: { '@type': 'Answer', text: 'Click Book Now, choose your service, select a date and time, complete the intake form, and receive a confirmation email.' } },
  ],
};

export default function HomePage() {
  return (
    <>
      <Seo
        title="Tax Preparation & Tax Planning Services | Eyneya Business Solutions — Kennesaw, GA"
        description="Premium tax preparation, planning, advisory, and strategy services for individuals, self-employed professionals, and business owners in Kennesaw, Marietta, and Metro Atlanta, GA."
        path="/"
        schema={faqSchema}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-purple-light via-white to-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" />
          <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-brand-purple/10 blur-3xl" />
        </div>
        <div className="container-wide hero-pad relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="animate-fade-up">
              <span className="badge-gold mb-5">
                <Sparkles className="h-3.5 w-3.5" />
                Kennesaw · Marietta · Metro Atlanta · Nationwide
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] text-balance">
                Tax Preparation, Planning, and Advisory Services
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-brand-slate max-w-xl">
                We help individuals, self-employed professionals, and business owners in Kennesaw, Marietta, and Metro Atlanta solve tax problems, avoid costly surprises, stay compliant, and make smarter tax decisions year-round.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/tax-preparation" className="btn-purple">
                  Start Tax Preparation
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/book" className="btn-outline">
                  <Calendar className="h-4 w-4" />
                  Book a Tax Advisory Session
                </Link>
              </div>
            </div>

            {/* Hero photo */}
            <div className="relative animate-fade-up flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm lg:max-w-md">
                <div
                  className="relative rounded-2xl overflow-hidden shadow-premium ring-2 ring-brand-gold/25"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img
                    src="/images/Davida_Website_Photo_1.jpg"
                    alt="Davida — Tax Advisor at Eyneya Business Solutions"
                    className="w-full h-full object-cover object-center"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/15 via-transparent to-transparent" />
                </div>
                {/* Floating credibility badge */}
                <div className="absolute -bottom-5 -left-4 card px-4 py-3 shadow-premium flex items-center gap-3 max-w-[230px] z-10">
                  <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-brand-gold-light">
                    <Star className="h-4 w-4 text-brand-warning fill-brand-warning" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-dark leading-tight">500+ Returns Filed</p>
                    <p className="text-xs text-brand-slate leading-tight mt-0.5">Trusted in all 50 states</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, label: 'Serving Kennesaw, Marietta & Metro Atlanta, GA' },
              { icon: Globe, label: 'Virtual Services Available Nationwide' },
              { icon: ShieldCheck, label: 'Secure & Confidential' },
              { icon: CheckCircle2, label: 'Professional Tax Advisors' },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-3 rounded-lg bg-white/70 px-4 py-3 border border-gray-100">
                <t.icon className="h-5 w-5 flex-shrink-0 text-brand-purple" />
                <span className="text-sm font-medium text-brand-dark">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-wide py-16">
          <div className="text-center mb-10">
            <span className="eyebrow">How It Works</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold">Book Your Tax Clarity Session in 4 Steps</h2>
            <p className="mt-2 text-brand-slate">Start online in minutes — no phone calls required to get started.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="card card-pad flex flex-col items-start gap-3">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-brand-purple text-sm font-bold text-white">
                  {s.step}
                </span>
                <div>
                  <p className="font-bold text-brand-dark">{s.title}</p>
                  <p className="mt-1 text-sm text-brand-slate leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/book" className="btn-gold">
              <Calendar className="h-4 w-4" />
              Book Your Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Tax Problems We Help Solve */}
      <Section bg="offwhite">
        <SectionHeader
          eyebrow="Solutions"
          title="Tax Problems We Help Solve"
          subtitle="From surprise bills to unfiled returns, we bring clarity and a clear path forward."
          center
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {TAX_PROBLEMS.map((p) => (
            <div key={p.title} className="card card-pad flex items-start gap-4 hover:shadow-card-hover transition-shadow">
              <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-brand-gold-light text-brand-warning">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-brand-dark">{p.title}</h3>
                <p className="mt-1 text-brand-slate leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Service Cards Preview */}
      <Section bg="white">
        <SectionHeader
          eyebrow="Our Services"
          title="Tax Services Designed for Clarity and Confidence"
          center
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_PREVIEWS.map((s) => {
            const Icon = ICONS[s.icon] ?? FileText;
            return (
              <Link key={s.slug} to={`/${s.slug}`} className="card card-pad group hover:shadow-card-hover transition-all hover:-translate-y-0.5">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-purple-light text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-brand-dark group-hover:text-brand-purple transition-colors">{s.name}</h3>
                <p className="mt-1.5 text-sm text-brand-slate leading-relaxed">{s.blurb}</p>
                {s.startingPrice && (
                  <p className="mt-3 text-sm font-semibold text-brand-purple">{s.startingPrice}</p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-purple">
                  See Options
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Service Area */}
      <section className="relative section-pad overflow-hidden">
        <img
          src="/images/Website_City_2.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/65" aria-hidden="true" />
        <div className="container-wide relative z-10">
          <SectionHeader
            eyebrow="Service Area"
            title="Serving Kennesaw, Marietta, and Metro Atlanta — Plus Clients Nationwide"
            subtitle={`Eyneya Business Solutions is based in Kennesaw, Georgia, with clients in Marietta, Acworth, Canton, Roswell, Smyrna, Sandy Springs, and throughout Metro Atlanta. We also work with clients virtually in all 50 states.`}
            center
            light
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: MapPin, title: 'Kennesaw, GA', sub: 'Main Office' },
              { icon: MapPin, title: 'Marietta, GA', sub: 'Local Clients Served' },
              { icon: Globe, title: 'All 50 States', sub: 'Virtual Services' },
            ].map((a) => (
              <div key={a.title} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center hover:bg-white/15 transition-colors">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/20 text-white">
                  <a.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{a.title}</h3>
                <p className="text-sm text-gray-300">{a.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Section bg="white">
        <SectionHeader eyebrow="Testimonials" title="What Our Clients Say" center />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </Section>

      {/* Ongoing Advisory Preview */}
      <Section bg="purple">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div>
            <span className="eyebrow text-brand-purple">Ongoing Support</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold">Need More Than One-Time Tax Help?</h2>
            <p className="mt-4 text-lg text-brand-slate leading-relaxed">
              Our Ongoing Tax Advisory plans provide year-round tax planning, compliance guidance, and strategy support for clients who want to stay ahead of tax season instead of reacting to it.
            </p>
            <Link to="/ongoing-advisory" className="btn-purple mt-6">
              View Ongoing Advisory Options
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Consultation photo */}
          <div className="hidden lg:block w-px self-stretch bg-gray-200" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
            <div className="rounded-xl overflow-hidden shadow-premium w-full lg:w-64 xl:w-72 flex-shrink-0">
              <img
                src="/images/Davida_Website_Photo_1.jpg"
                alt="Tax advisory consultation session"
                className="w-full object-cover object-top"
                style={{ maxHeight: '320px' }}
                loading="lazy"
              />
            </div>
            <div className="card card-pad bg-white flex-1">
              <h3 className="text-lg font-bold">Plan options include:</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Quarterly tax check-ins and planning',
                  'Estimated tax payment guidance',
                  'Compliance review and gap summaries',
                  'Entity structure and S-Corp planning',
                  'Year-round advisory touchpoints',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-brand-slate">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-brand-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section bg="white">
        <CtaBanner
          title="Ready to Get Clear About Your Taxes?"
          subtitle="Book your appointment online in minutes. Choose a service, pick a time, and receive confirmation right away."
          primary={{ label: 'Start My Tax Service', to: '/book' }}
          secondary={{ label: 'Book a Consultation', to: '/book' }}
          note={`Serving Kennesaw, Marietta, and Metro Atlanta — virtual services available nationwide. Call ${BUSINESS.phone} or email ${BUSINESS.email}.`}
        />
      </Section>
    </>
  );
}
