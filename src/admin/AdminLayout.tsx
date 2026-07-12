import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Calendar, BookOpen, Users, CreditCard, Mail,
  MessageSquare, Settings, LogOut, Menu, X, ExternalLink, FileText,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { cn } from '../lib/utils';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { to: '/admin/bookings', label: 'Bookings', icon: BookOpen },
  { to: '/admin/clients', label: 'Clients', icon: Users },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/emails', label: 'Emails', icon: Mail },
  { to: '/admin/contact', label: 'Contact', icon: MessageSquare },
  { to: '/admin/blog', label: 'Tax Tips', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !session) {
      navigate('/admin/login', { replace: true });
    }
  }, [session, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="animate-pulse text-brand-slate">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 z-40 h-screen w-64 flex-shrink-0 bg-brand-dark text-gray-300 transition-transform lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
          <Link to="/admin/dashboard" className="font-serif text-lg font-bold text-white">Eyneya Admin</Link>
          <button className="lg:hidden text-gray-400" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-brand-purple text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                )
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
          <div className="pt-3 mt-3 border-t border-white/10 space-y-1">
            <Link to="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white">
              <ExternalLink className="h-4.5 w-4.5" />
              View Site
            </Link>
            <button
              onClick={async () => {
                await signOut();
                navigate('/admin/login');
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4.5 w-4.5" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8">
          <button className="lg:hidden text-brand-dark" onClick={() => setMobileOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <p className="text-sm text-brand-slate hidden lg:block">Welcome back to the Eyneya admin dashboard</p>
          <span className="badge-purple">{session.user.email}</span>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
