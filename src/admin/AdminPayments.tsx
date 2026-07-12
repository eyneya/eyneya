import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { fetchPayments } from './adminData';
import { formatShortDate, cn, formatMoney } from '../lib/utils';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthFilter, setMonthFilter] = useState('');

  useEffect(() => {
    fetchPayments()
      .then((p) => setPayments(p))
      .finally(() => setLoading(false));
  }, []);

  const filtered = monthFilter
    ? payments.filter((p) => new Date(p.created_at).getMonth() === Number(monthFilter))
    : payments;

  const monthRevenue = filtered
    .filter((p) => p.status === 'succeeded')
    .reduce((s, p) => s + p.amount_cents, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-brand-dark">Payments</h1>
        <select className="input w-auto" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
          <option value="">All months</option>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i}>{new Date(2000, i).toLocaleString('en-US', { month: 'long' })}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="card card-pad flex items-center gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-emerald-50 text-brand-success">
          <TrendingUp className="h-6 w-6" />
        </span>
        <div>
          <p className="text-2xl font-bold text-brand-dark font-serif">{formatMoney(monthRevenue)}</p>
          <p className="text-sm text-brand-slate">Revenue {monthFilter ? `in ${new Date(2000, Number(monthFilter)).toLocaleString('en-US', { month: 'long' })}` : 'all time'} ({filtered.filter((p) => p.status === 'succeeded').length} payments)</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-brand-slate">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-brand-slate">No payments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Date</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Client</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Amount</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Status</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Booking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-brand-slate">{formatShortDate(p.created_at)}</td>
                    <td className="px-4 py-3 font-medium text-brand-dark">{p.clients?.full_name ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold text-brand-purple">{formatMoney(p.amount_cents)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('badge', p.status === 'succeeded' ? 'badge-success' : p.status === 'failed' ? 'badge-error' : 'badge-slate')}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {p.booking_id ? <Link to={`/admin/bookings/${p.booking_id}`} className="text-brand-purple hover:underline text-xs">{p.bookings?.booking_reference ?? 'View'}</Link> : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
