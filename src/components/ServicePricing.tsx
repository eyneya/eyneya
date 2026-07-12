import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import type { Service, ServiceTier } from '../lib/types';
import { PricingDisclaimer } from './ui/PricingCard';
import { cn } from '../lib/utils';

interface ServicePricingProps {
  service: Service;
  ctaLabel?: string;
  highlightedTier?: string; // tier name to highlight
}

export default function ServicePricing({ service, ctaLabel = 'Start Tax Service', highlightedTier }: ServicePricingProps) {
  const tiers = service.service_tiers ?? [];
  if (tiers.length === 0) {
    return (
      <div className="text-center">
        <p className="text-brand-slate">Pricing coming soon. Please contact us for a quote.</p>
        <Link to="/contact" className="btn-outline mt-4">Contact Us</Link>
      </div>
    );
  }

  return (
    <div>
      <div className={cn('grid gap-6', tiers.length === 1 ? 'sm:grid-cols-1 max-w-xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3')}>
        {tiers.map((tier) => (
          <TierCard key={tier.id} tier={tier} ctaLabel={ctaLabel} highlighted={highlightedTier === tier.name} />
        ))}
      </div>
      <PricingDisclaimer />
    </div>
  );
}

function TierCard({ tier, ctaLabel, highlighted }: { tier: ServiceTier; ctaLabel: string; highlighted?: boolean }) {
  const bookUrl = `/book?service=${tier.service_id}&tier=${tier.id}`;
  const features = tier.best_for.split(/[,;]/).map((s) => s.trim()).filter(Boolean).slice(0, 5);

  return (
    <div className={cn('card card-pad flex flex-col transition-all hover:shadow-card-hover', highlighted && 'ring-2 ring-brand-purple shadow-premium')}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-brand-dark">{tier.name}</h3>
        {tier.is_recurring && <span className="badge-gold flex-shrink-0">Recurring</span>}
      </div>
      <p className="mt-4 text-2xl font-bold text-brand-purple font-serif">{tier.price_display}</p>
      <p className="mt-3 text-sm text-brand-slate leading-relaxed">
        <span className="font-semibold text-brand-dark">Best for:</span> {tier.best_for}
      </p>
      {features.length > 0 && (
        <ul className="mt-5 space-y-2 flex-1">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-brand-slate">
              <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-brand-success" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}
      <Link to={bookUrl} className={cn('mt-6', highlighted ? 'btn-purple' : 'btn-outline')}>
        {ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
