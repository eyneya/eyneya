import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Users, BookOpen, ArrowRight, Clock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatTime, formatShortDate, relativeTime, cn } from '../lib/utils';

interface DashboardData {
  todayCount: number;
  monthCount: number;
  monthRevenue: number;
  newClients: number;
  todayBookings: any[];
  recentBookings: any[];
  unreadContacts: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [today, month, revenue, clients, recent, contacts] = await Promise.all([
        supabase.from('bookings').select('*, clients(full_name, email)').gte('appointment_start', todayStart).lte('appointment_start', todayEnd).neq('status', 'cancelled').order('appointment_start'),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
        supabase.from('payments').select('amount_cents').eq('status', 'succeeded').gte('created_at', monthStart),
        supabase.from('clients').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
        supabase.from('bookings').select('*, clients(full_name, email)').order('created_at', { ascending: false }).limit(10),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      ]);

      setData({
        todayCount: today.data?.length ?? 0,
        monthCount: month.count ?? 0,
        monthRevenue: (revenue.data ?? []).reduce((s: number, p: any) => s + p.amount_cents, 0),
        newClients: clients.count ?? 0,
        todayBookings: today.data ?? [],
        recentBookings: recent.data ?? [],
        unreadContacts: contacts.count ?? 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !data) {
    return <div className="animate-pulse text-brand-slate">Loading dashboard...</div>;
  }

  const metrics = [
    { label: "Today's Appointments", value: data.todayCount, icon: Calendar, to: '/admin/calendar', color: 'bg-brand-purple-light text-brand-purple' },
    { label: "This Month's Bookings", value: data.monthCount, icon: BookOpen, to: '/admin/bookings', color: 'bg-brand-gold-light text-brand-warning' },
    { label: "This Month's Revenue", value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.monthRevenue / 100), icon: TrendingUp, to: '/admin/payments', color: 'bg-emerald-50 text-brand-success' },
    { label: 'New Clients This Month', value: data.newClients, icon: Users, to: '/admin/clients', color: 'bg-blue-50 text-blue-600' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Link key={m.label} to={m.to} className="card card-pad hover:shadow-card-hover transition-shadow">
            <div className="flex items-center justify-between">
              <span className={cn('grid h-10 w-10 place-items-center rounded-lg', m.color)}>
                <m.icon className="h-5 w-5" />
              </span>
              <ArrowRight className="h-4 w-4 text-gray-300" />
            </div>
            <p className="mt-3 text-2xl font-bold text-brand-dark font-serif">{m.value}</p>
            <p className="text-sm text-brand-slate">{m.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's schedule */}
        <div className="card card-pad">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-brand-dark flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-purple" />
              Today's Schedule
            </h2>
            <Link to="/admin/calendar" className="text-sm font-semibold text-brand-purple hover:underline">View calendar</Link>
          </div>
          {data.todayBookings.length === 0 ? (
            <p className="text-sm text-brand-slate py-6 text-center">No appointments today.</p>
          ) : (
            <ul className="space-y-2">
              {data.todayBookings.map((b: any) => (
                <li key={b.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">{b.clients?.full_name ?? 'Unknown'}</p>
                    <p className="text-xs text-brand-slate">{b.service_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brand-purple">{formatTime(b.appointment_start)}</p>
                    <span className={cn('badge text-[10px]', b.status === 'confirmed' ? 'badge-success' : 'badge-slate')}>{b.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent bookings */}
        <div className="card card-pad">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-brand-dark flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-purple" />
              Recent Bookings
            </h2>
            <Link to="/admin/bookings" className="text-sm font-semibold text-brand-purple hover:underline">View all</Link>
          </div>
          <ul className="space-y-2">
            {data.recentBookings.slice(0, 6).map((b: any) => (
              <li key={b.id}>
                <Link to={`/admin/bookings/${b.id}`} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-brand-purple-light transition-colors">
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">{b.clients?.full_name ?? 'Unknown'}</p>
                    <p className="text-xs text-brand-slate">{b.service_name} · {b.booking_reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-brand-slate">{formatShortDate(b.appointment_start)}</p>
                    <p className="text-[10px] text-brand-slate">{relativeTime(b.created_at)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Unread contacts alert */}
      {data.unreadContacts > 0 && (
        <Link to="/admin/contact" className="card card-pad flex items-center gap-4 hover:shadow-card-hover transition-shadow border-brand-gold/30">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-gold-light text-brand-warning">
            <Mail className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-brand-dark">{data.unreadContacts} unread contact submission{data.unreadContacts > 1 ? 's' : ''}</p>
            <p className="text-sm text-brand-slate">Review and respond to new inquiries</p>
          </div>
          <ArrowRight className="h-5 w-5 text-brand-purple" />
        </Link>
      )}
    </div>
  );
}
