import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Globe } from 'lucide-react';
import Logo from './Logo';
import { BUSINESS, PRICING_DISCLAIMER } from '../lib/constants';
import { SERVICES_NAV, MAIN_NAV, LEARN_CONNECT_NAV } from '../lib/nav';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-300">
      <div className="container-wide py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo variant="light" />
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Premium tax preparation, planning, and advisory services for individuals, self-employed professionals, and business owners.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4 text-brand-gold" />
                {BUSINESS.city}, {BUSINESS.state} — Serving {BUSINESS.region}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Globe className="h-4 w-4 text-brand-gold" />
                Virtual services in all 50 states
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <ShieldCheck className="h-4 w-4 text-brand-gold" />
                Secure & confidential
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SERVICES_NAV.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="text-gray-400 hover:text-brand-gold transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[...MAIN_NAV, ...LEARN_CONNECT_NAV].map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="text-gray-400 hover:text-brand-gold transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/book" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={`tel:${BUSINESS.phone.replace(/[^\d]/g, '')}`} className="flex items-center gap-2 text-gray-400 hover:text-brand-gold transition-colors">
                  <Phone className="h-4 w-4 text-brand-gold" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 text-gray-400 hover:text-brand-gold transition-colors">
                  <Mail className="h-4 w-4 text-brand-gold" />
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <Clock className="h-4 w-4 mt-0.5 text-brand-gold" />
                <span>
                  Mon–Fri: 9:00 AM – 5:00 PM<br />
                  Sat: By appointment
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-xs leading-relaxed text-gray-500 italic max-w-4xl">{PRICING_DISCLAIMER}</p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
