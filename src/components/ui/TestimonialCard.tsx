import { Star, Quote } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Testimonial {
  quote: string;
  name: string;
  context: string;
  location: string;
}

const AVATAR_COLORS = [
  'bg-brand-purple text-white',
  'bg-brand-gold text-brand-dark',
  'bg-brand-dark text-white',
  'bg-emerald-600 text-white',
  'bg-brand-purple-dark text-white',
  'bg-amber-600 text-white',
];

function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function TestimonialCard({
  t,
  index = 0,
  className,
}: {
  t: Testimonial;
  index?: number;
  className?: string;
}) {
  return (
    <div className={cn('card card-pad flex flex-col', className)}>
      <Quote className="h-8 w-8 text-brand-gold/40" />
      <div className="mt-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" />
        ))}
      </div>
      <p className="mt-4 text-brand-dark leading-relaxed flex-1">"{t.quote}"</p>
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
        <span
          className={cn(
            'grid h-10 w-10 flex-shrink-0 place-items-center rounded-full text-sm font-bold',
            getAvatarColor(index),
          )}
        >
          {getInitials(t.name)}
        </span>
        <div>
          <p className="font-semibold text-brand-dark">{t.name}</p>
          <p className="text-sm text-brand-slate">{t.context}</p>
          <p className="text-sm text-brand-slate">{t.location}</p>
        </div>
      </div>
    </div>
  );
}
