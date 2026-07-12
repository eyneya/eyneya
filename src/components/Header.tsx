import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, Calendar } from 'lucide-react';
import Logo from './Logo';
import { SERVICES_NAV, MAIN_NAV, LEARN_CONNECT_NAV } from '../lib/nav';
import { cn } from '../lib/utils';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setLearnOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white',
      )}
    >
      <nav className="container-wide flex h-16 items-center justify-between lg:h-20" aria-label="Primary">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-brand-dark hover:text-brand-purple transition-colors"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services
              <ChevronDown className={cn('h-4 w-4 transition-transform', servicesOpen && 'rotate-180')} />
            </button>
            {servicesOpen && (
              <div className="absolute left-0 top-full pt-2 w-[460px] animate-slide-down">
                <div className="card card-pad grid grid-cols-1 gap-1 shadow-premium">
                  <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-brand-purple">Tax Services</p>
                  {SERVICES_NAV.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="rounded-lg p-3 hover:bg-brand-purple-light transition-colors group"
                    >
                      <div className="font-semibold text-brand-dark group-hover:text-brand-purple">{item.label}</div>
                      {item.description && <div className="text-sm text-brand-slate mt-0.5">{item.description}</div>}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                  isActive ? 'text-brand-purple' : 'text-brand-dark hover:text-brand-purple',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* Learn & Connect dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setLearnOpen(true)}
            onMouseLeave={() => setLearnOpen(false)}
          >
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-brand-dark hover:text-brand-purple transition-colors"
              aria-expanded={learnOpen}
              aria-haspopup="true"
            >
              Learn &amp; Connect
              <ChevronDown className={cn('h-4 w-4 transition-transform', learnOpen && 'rotate-180')} />
            </button>
            {learnOpen && (
              <div className="absolute right-0 top-full pt-2 w-48 animate-slide-down">
                <div className="card card-pad flex flex-col gap-1 shadow-premium">
                  {LEARN_CONNECT_NAV.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="rounded-lg px-3 py-2 font-semibold text-brand-dark hover:bg-brand-purple-light hover:text-brand-purple transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex items-center">
          <Link to="/book" className="btn-gold btn-sm">
            <Calendar className="h-4 w-4" />
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden grid h-10 w-10 place-items-center rounded-lg text-brand-dark hover:bg-brand-purple-light"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-white animate-fade-in overflow-y-auto">
          <div className="container-wide py-6 space-y-6">
            <div>
              <p className="eyebrow mb-3">Services</p>
              <div className="space-y-1">
                {SERVICES_NAV.map((item) => (
                  <Link key={item.to} to={item.to} className="block rounded-lg p-3 hover:bg-brand-purple-light">
                    <div className="font-semibold text-brand-dark">{item.label}</div>
                    {item.description && <div className="text-sm text-brand-slate">{item.description}</div>}
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6">
              <p className="eyebrow mb-3">Advisory & Planning</p>
              <div className="grid grid-cols-1 gap-1">
                {MAIN_NAV.map((item) => (
                  <Link key={item.to} to={item.to} className="rounded-lg p-3 font-semibold text-brand-dark hover:bg-brand-purple-light">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6">
              <p className="eyebrow mb-3">Learn &amp; Connect</p>
              <div className="grid grid-cols-1 gap-1">
                {LEARN_CONNECT_NAV.map((item) => (
                  <Link key={item.to} to={item.to} className="rounded-lg p-3 font-semibold text-brand-dark hover:bg-brand-purple-light">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/book" className="btn-gold w-full">
              <Calendar className="h-4 w-4" />
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
