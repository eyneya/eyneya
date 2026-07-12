import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  bg?: 'white' | 'offwhite' | 'purple' | 'dark';
  id?: string;
}

const bgMap = {
  white: 'bg-white',
  offwhite: 'bg-brand-offwhite',
  purple: 'bg-brand-purple-light',
  dark: 'bg-brand-dark text-gray-300',
};

export function Section({ children, className, bg = 'white', id }: SectionProps) {
  return (
    <section id={id} className={cn('section-pad', bgMap[bg], className)}>
      <div className="container-wide">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
  className?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, center, light, className }: SectionHeaderProps) {
  return (
    <div className={cn(center && 'text-center mx-auto max-w-3xl', className)}>
      {eyebrow && (
        <p className={cn('eyebrow mb-3', light ? 'text-brand-gold' : 'text-brand-purple')}>{eyebrow}</p>
      )}
      <h2 className={cn('text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight text-balance', light && 'text-white')}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 text-lg leading-relaxed', light ? 'text-gray-400' : 'text-brand-slate')}>{subtitle}</p>
      )}
    </div>
  );
}

interface EyebrowLabelProps {
  children: ReactNode;
  className?: string;
}

export function EyebrowLabel({ children, className }: EyebrowLabelProps) {
  return <p className={cn('eyebrow', className)}>{children}</p>;
}
