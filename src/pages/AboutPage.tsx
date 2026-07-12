import { Link } from 'react-router-dom';
import { Target, Users, Compass, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import { CtaBanner } from '../components/ui/PricingCard';
import { BUSINESS } from '../lib/constants';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Eyneya Business Solutions | Tax Advisor in Kennesaw, GA"
        description="Learn about Eyneya Business Solutions — a premium tax advisory firm based in Kennesaw, Georgia, serving individuals, self-employed professionals, and business owners in Metro Atlanta and nationwide."
        path="/about"
      />
      <PageHero
        eyebrow="About Us"
        title="About Eyneya Business Solutions"
        subtitle="A premium tax advisory firm based in Kennesaw, Georgia, helping individuals, self-employed professionals, and business owners get clear about their taxes."
      />

      {/* Mission */}
      <Section bg="white">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">Our Mission</span>
            <h2 className="mt-3 text-3xl font-bold">Clarity Over Confusion. Strategy Over Reaction.</h2>
            <p className="mt-4 text-lg text-brand-slate leading-relaxed">
              We believe taxes should not be a source of anxiety. Our mission is to help every client understand their tax situation, make informed decisions, and feel confident that their taxes are handled accurately and professionally — whether they are filing a simple return or building a long-term business strategy.
            </p>
            <p className="mt-4 text-brand-slate leading-relaxed">
              We serve clients who want more than a once-a-year transaction. They want a tax partner who explains things in plain English, proactively flags issues, and helps them avoid costly surprises.
            </p>
          </div>
          <div className="card card-pad bg-brand-purple-light border-brand-purple/20">
            <Target className="h-10 w-10 text-brand-purple" />
            <h3 className="mt-4 text-xl font-bold">What Sets Us Apart</h3>
            <ul className="mt-4 space-y-3">
              {[
                'Transparent pricing posted on every service page',
                'Online booking with a 30-day rolling calendar',
                'Automated confirmations and reminders',
                'Plain-English explanations, no jargon',
                'Year-round support, not just tax season',
                'Virtual services for clients in all 50 states',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-brand-dark">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-brand-success" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Who We Serve */}
      <Section bg="offwhite">
        <SectionHeader eyebrow="Who We Serve" title="Clients We Work With" center />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { icon: Users, title: 'Individuals', desc: 'W-2 earners, families, and investors who want accurate filing and proactive planning.' },
            { icon: Compass, title: 'Self-Employed Professionals', desc: 'Freelancers, gig workers, and 1099 earners navigating deductions and estimated taxes.' },
            { icon: Target, title: 'Business Owners', desc: 'LLC, S-Corp, and partnership owners needing strategy, compliance, and year-round advisory.' },
          ].map((g) => (
            <div key={g.title} className="card card-pad text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-purple-light text-brand-purple">
                <g.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{g.title}</h3>
              <p className="mt-2 text-sm text-brand-slate leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Our Approach */}
      <Section bg="white">
        <SectionHeader eyebrow="Our Approach" title="Precision. Clarity. Year-Round Support." center />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { title: 'Precision', desc: 'Every return and advisory engagement is prepared with meticulous attention to detail and reviewed for accuracy.' },
            { title: 'Clarity', desc: 'We explain your tax situation in language you understand, so you can make confident decisions.' },
            { title: 'Year-Round Support', desc: 'Tax planning does not stop in April. We help you stay ahead all year with proactive guidance and reminders.' },
          ].map((a) => (
            <div key={a.title} className="card card-pad">
              <h3 className="text-lg font-bold text-brand-purple font-serif">{a.title}</h3>
              <p className="mt-2 text-brand-slate leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Service Area */}
      <Section bg="offwhite">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">Service Area</span>
            <h2 className="mt-3 text-3xl font-bold">Based in Kennesaw. Serving Metro Atlanta and Beyond.</h2>
            <p className="mt-4 text-brand-slate leading-relaxed">
              Eyneya Business Solutions is based in {BUSINESS.city}, {BUSINESS.state}, with clients across {BUSINESS.serviceArea.join(', ')}, and throughout {BUSINESS.region}. We also work with clients virtually in all 50 states.
            </p>
            <Link to="/contact" className="btn-outline mt-6">
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {BUSINESS.serviceArea.map((city) => (
              <div key={city} className="card p-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-purple flex-shrink-0" />
                <span className="text-sm font-medium text-brand-dark">{city}</span>
              </div>
            ))}
            <div className="card p-4 flex items-center gap-2 bg-brand-purple text-white">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">All 50 States (Virtual)</span>
            </div>
          </div>
        </div>
      </Section>

      <Section bg="white">
        <CtaBanner
          title="Work With Us"
          subtitle="Book an appointment or send us a message. We respond within one business day."
          primary={{ label: 'Book an Appointment', to: '/book' }}
          secondary={{ label: 'Contact Us', to: '/contact' }}
        />
      </Section>
    </>
  );
}
