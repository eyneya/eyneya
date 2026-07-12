import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Ban } from 'lucide-react';
import { fetchBookings, updateBookingStatus } from './adminData';
import { formatShortDate, formatTime, cn } from '../lib/utils';
import type { Booking } from '../lib/types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'badge-gold',
  confirmed: 'badge-success',
  cancelled: 'badge-error',
  completed: 'badge-purple',
  no_show: 'badge-slate',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchBookings({ status: statusFilter, search })
      .then((b) => setBookings(b as Booking[]))
      .finally(() => setLoading(false));
  }, [statusFilter, search]);

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking? This cannot be undone.')) return;
    await updateBookingStatus(id, 'cancelled');
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-brand-dark">Bookings</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="input pl-9 w-56"
              placeholder="Search reference or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
            <option value="no_show">No Show</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-brand-slate">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-brand-slate">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Reference</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Client</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Service</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Date / Time</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Status</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Payment</th>
                  <th className="text-right font-semibold text-brand-dark px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-brand-purple">{b.booking_reference}</td>
                    <td className="px-4 py-3 font-medium text-brand-dark">{(b as any).clients?.full_name ?? '—'}</td>
                    <td className="px-4 py-3 text-brand-slate">{b.service_name}</td>
                    <td className="px-4 py-3 text-brand-slate">
                      {formatShortDate(b.appointment_start)}
                      <br />
                      <span className="text-xs">{formatTime(b.appointment_start)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(STATUS_COLORS[b.status] ?? 'badge-slate')}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('badge', b.payment_status === 'paid' ? 'badge-success' : b.payment_status === 'unpaid' ? 'badge-slate' : 'badge-gold')}>
                        {b.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/bookings/${b.id}`} className="btn-ghost btn-sm" title="View">
                          <Eye className="h-4 w-4" />
                        </Link>
                        {b.status !== 'cancelled' && (
                          <button onClick={() => handleCancel(b.id)} className="btn-ghost btn-sm text-brand-error" title="Cancel">
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                      </div>
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
