import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ items, title = 'Frequently Asked Questions' }: { items: FaqItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">{title}</h2>
      <div className="mx-auto max-w-3xl space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className={cn('card overflow-hidden transition-shadow', isOpen && 'shadow-card-hover')}>
              <button
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-brand-dark">{item.q}</span>
                <ChevronDown className={cn('h-5 w-5 flex-shrink-0 text-brand-purple transition-transform', isOpen && 'rotate-180')} />
              </button>
              <div className={cn('grid transition-all duration-300', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-brand-slate leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
