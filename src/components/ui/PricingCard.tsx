import type { ReactNode } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { PRICING_DISCLAIMER } from '../../lib/constants';

interface PricingCardProps {
  name: string;
  price: string;
  bestFor: string;
  features?: string[];
  cta: { label: string; to: string };
  highlighted?: boolean;
  badge?: string;
  className?: string;
}

export default function PricingCard({ name, price, bestFor, features, cta, highlighted, badge, className }: PricingCardProps) {
  return (
    <div
      className={cn(
        'card card-pad flex flex-col transition-all duration-300 hover:shadow-card-hover',
        highlighted && 'ring-2 ring-brand-purple shadow-premium relative',
        className,
      )}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-gold shadow-sm">{badge}</span>
      )}
      <h3 className="text-xl font-bold text-brand-dark">{name}</h3>
      <p className="mt-4 text-3xl font-bold text-brand-purple font-serif">{price}</p>
      <p className="mt-3 text-sm text-brand-slate leading-relaxed">
        <span className="font-semibold text-brand-dark">Best for:</span> {bestFor}
      </p>
      {features && features.length > 0 && (
        <ul className="mt-6 space-y-2.5 flex-1">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-brand-slate">
              <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-brand-success" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}
      <Link to={cta.to} className={cn('mt-6', highlighted ? 'btn-purple' : 'btn-outline')}>
        {cta.label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function PricingDisclaimer() {
  return (
    <p className="mt-10 mx-auto max-w-3xl text-center text-xs leading-relaxed text-brand-slate italic">
      {PRICING_DISCLAIMER}
    </p>
  );
}

interface CtaBannerProps {
  title: string;
  subtitle?: string;
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
  note?: ReactNode;
}

export function CtaBanner({ title, subtitle, primary, secondary, note }: CtaBannerProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-purple to-brand-purple-dark px-6 py-12 sm:px-12 sm:py-16 text-center shadow-premium">
      <h2 className="text-3xl sm:text-4xl font-bold text-white text-balance">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-brand-purple-light max-w-2xl mx-auto">{subtitle}</p>}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to={primary.to} className="btn-gold">
          {primary.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
        {secondary && (
          <Link to={secondary.to} className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20">
            {secondary.label}
          </Link>
        )}
      </div>
      {note && <p className="mt-6 text-sm text-brand-purple-light italic">{note}</p>}
    </div>
  );
}
