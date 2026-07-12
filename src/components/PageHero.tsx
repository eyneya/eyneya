import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; to: string };
  showCallCta?: boolean;
  phone?: string;
  children?: ReactNode;
}

export default function PageHero({ eyebrow, title, subtitle, cta, showCallCta, phone, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-purple-light to-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
      </div>
      <div className="container-wide py-16 sm:py-20 relative">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance max-w-4xl">{title}</h1>
        {subtitle && <p className="mt-5 text-lg text-brand-slate leading-relaxed max-w-3xl">{subtitle}</p>}
        {cta && (
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
            <Link to={cta.to} className="btn-purple">
              {cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {showCallCta && phone && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-brand-slate hidden sm:block">or</span>
                <a
                  href={`tel:${phone.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-gold bg-brand-gold-light px-5 py-2.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-gold/20"
                >
                  <Phone className="h-4 w-4 text-brand-warning" />
                  Call for a 10-Minute Assessment
                </a>
              </div>
            )}
          </div>
        )}
        {showCallCta && phone && (
          <p className="mt-3 text-xs text-brand-slate">Have a Question Before You Book? &nbsp;{phone}</p>
        )}
        {children}
      </div>
    </section>
  );
}
