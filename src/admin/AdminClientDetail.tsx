import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Building2, FileText, CreditCard } from 'lucide-react';
import { fetchClientById } from './adminData';
import { formatShortDate, formatTime, cn } from '../lib/utils';

export default function AdminClientDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchClientById(id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="animate-pulse text-brand-slate">Loading...</div>;
  if (!data) return <div className="text-center py-12"><p className="text-brand-slate">Client not found.</p><Link to="/admin/clients" className="btn-outline mt-4">Back to clients</Link></div>;

  const { client, bookings, payments } = data;

  return (
    <div className="space-y-6">
      <Link to="/admin/clients" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-purple hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to clients
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile */}
        <div className="card card-pad lg:col-span-1">
          <h1 className="text-xl font-bold text-brand-dark">{client.full_name}</h1>
          <div className="mt-4 space-y-3 text-sm">
            <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-brand-slate hover:text-brand-purple"><Mail className="h-4 w-4 text-brand-purple" /> {client.email}</a>
            {client.phone && <p className="flex items-center gap-2 text-brand-slate"><Phone className="h-4 w-4 text-brand-purple" /> {client.phone}</p>}
            {client.address_city && <p className="flex items-center gap-2 text-brand-slate"><MapPin className="h-4 w-4 text-brand-purple" /> {client.address_city}, {client.address_state}</p>}
            {client.business_name && <p className="flex items-center gap-2 text-brand-slate"><Building2 className="h-4 w-4 text-brand-purple" /> {client.business_name}</p>}
            <p className="text-xs text-brand-slate pt-2 border-t border-gray-100">Client since {formatShortDate(client.created_at)}</p>
            {client.tax_situation && <p className="text-sm text-brand-slate"><strong className="text-brand-dark">Notes:</strong> {client.tax_situation}</p>}
          </div>
        </div>

        {/* Booking history */}
        <div className="card card-pad lg:col-span-2">
          <h2 className="font-bold text-brand-dark flex items-center gap-2 mb-4"><FileText className="h-5 w-5 text-brand-purple" /> Booking History ({bookings.length})</h2>
          {bookings.length === 0 ? (
            <p className="text-sm text-brand-slate">No bookings yet.</p>
          ) : (
            <ul className="space-y-2">
              {bookings.map((b: any) => (
                <li key={b.id}>
                  <Link to={`/admin/bookings/${b.id}`} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-brand-purple-light transition-colors">
                    <div>
                      <p className="font-semibold text-sm text-brand-dark">{b.service_name}</p>
                      <p className="text-xs text-brand-slate">{b.booking_reference}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-brand-slate">{formatShortDate(b.appointment_start)} {formatTime(b.appointment_start)}</p>
                      <span className={cn('badge text-[10px]', b.status === 'confirmed' ? 'badge-success' : b.status === 'cancelled' ? 'badge-error' : 'badge-slate')}>{b.status}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Payment history */}
          <h2 className="font-bold text-brand-dark flex items-center gap-2 mb-4 mt-6 pt-6 border-t border-gray-100"><CreditCard className="h-5 w-5 text-brand-purple" /> Payment History ({payments.length})</h2>
          {payments.length === 0 ? (
            <p className="text-sm text-brand-slate">No payments recorded.</p>
          ) : (
            <ul className="space-y-2">
              {payments.map((p: any) => (
                <li key={p.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">${p.amount_cents / 100}</p>
                    <p className="text-xs text-brand-slate">{formatShortDate(p.created_at)}</p>
                  </div>
                  <span className={cn('badge text-[10px]', p.status === 'succeeded' ? 'badge-success' : p.status === 'failed' ? 'badge-error' : 'badge-slate')}>{p.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
