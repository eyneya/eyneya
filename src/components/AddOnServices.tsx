import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHeader } from './ui/Section';
import { ADD_ON_SERVICES } from '../lib/content';

export default function AddOnServices() {
  return (
    <Section bg="offwhite">
      <SectionHeader eyebrow="Add-Ons" title="Additional Tax Services" center />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADD_ON_SERVICES.map((a) => (
          <div key={a.name} className="card card-pad">
            <h3 className="font-semibold text-brand-dark">{a.name}</h3>
            <p className="mt-2 text-lg font-bold text-brand-purple font-serif">{a.price}</p>
            {a.note && <p className="mt-1 text-xs text-brand-slate italic">{a.note}</p>}
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link to="/book" className="btn-outline">
          Request a Tax Service
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}
