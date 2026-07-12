import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Mail, CheckCircle2, Ban, Calendar as CalIcon, User, FileText, CreditCard } from 'lucide-react';
import { fetchBookingById, updateBookingStatus, updateBookingNotes } from './adminData';
import { formatDate, formatTime, formatShortDate, cn } from '../lib/utils';

export default function AdminBookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchBookingById(id)
      .then((b) => {
        setBooking(b);
        setNotes(b?.admin_notes ?? '');
        setStatus(b?.status ?? 'pending');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    await updateBookingNotes(id, notes);
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    setStatus(newStatus);
    await updateBookingStatus(id, newStatus);
    setBooking((prev: any) => (prev ? { ...prev, status: newStatus } : prev));
  };

  if (loading) return <div className="animate-pulse text-brand-slate">Loading...</div>;
  if (!booking) return <div className="text-center py-12"><p className="text-brand-slate">Booking not found.</p><Link to="/admin/bookings" className="btn-outline mt-4">Back to bookings</Link></div>;

  const client = booking.clients;

  return (
    <div className="space-y-6">
      <Link to="/admin/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-purple hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to bookings
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">{booking.booking_reference}</h1>
          <p className="text-brand-slate">{booking.service_name} — {booking.tier_name}</p>
        </div>
        <select value={status} onChange={(e) => handleStatusChange(e.target.value)} className="input w-auto">
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No Show</option>
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Appointment details */}
        <div className="card card-pad lg:col-span-2 space-y-6">
          <div>
            <h2 className="font-bold text-brand-dark flex items-center gap-2 mb-3">
              <CalIcon className="h-5 w-5 text-brand-purple" /> Appointment
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-brand-slate uppercase">Date</p><p className="font-semibold text-brand-dark">{formatDate(booking.appointment_start)}</p></div>
              <div><p className="text-xs text-brand-slate uppercase">Time</p><p className="font-semibold text-brand-dark">{formatTime(booking.appointment_start)} — {formatTime(booking.appointment_end)}</p></div>
              <div><p className="text-xs text-brand-slate uppercase">Timezone</p><p className="font-semibold text-brand-dark">{booking.timezone}</p></div>
              <div><p className="text-xs text-brand-slate uppercase">Price</p><p className="font-semibold text-brand-purple">{booking.price_display}</p></div>
            </div>
          </div>

          {/* Client info */}
          <div className="border-t border-gray-100 pt-5">
            <h2 className="font-bold text-brand-dark flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-brand-purple" /> Client
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-brand-slate uppercase">Name</p><p className="font-semibold text-brand-dark">{client?.full_name ?? '—'}</p></div>
              <div><p className="text-xs text-brand-slate uppercase">Email</p><a href={`mailto:${client?.email}`} className="font-semibold text-brand-purple">{client?.email ?? '—'}</a></div>
              <div><p className="text-xs text-brand-slate uppercase">Phone</p><p className="font-semibold text-brand-dark">{client?.phone ?? '—'}</p></div>
              <div><p className="text-xs text-brand-slate uppercase">Location</p><p className="font-semibold text-brand-dark">{client?.address_city ? `${client.address_city}, ${client.address_state}` : '—'}</p></div>
            </div>
          </div>

          {/* Intake */}
          <div className="border-t border-gray-100 pt-5">
            <h2 className="font-bold text-brand-dark flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-brand-purple" /> Intake Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {booking.filing_status && <div><p className="text-xs text-brand-slate uppercase">Filing Status</p><p className="font-semibold text-brand-dark">{booking.filing_status}</p></div>}
              {booking.tax_year && <div><p className="text-xs text-brand-slate uppercase">Tax Year</p><p className="font-semibold text-brand-dark">{booking.tax_year}</p></div>}
              <div className="col-span-2 space-y-1">
                <p className="text-xs text-brand-slate uppercase">Tax Situation</p>
                <div className="flex flex-wrap gap-2">
                  {booking.has_business_income && <span className="badge-purple">Business income</span>}
                  {booking.has_investments && <span className="badge-purple">Investments</span>}
                  {booking.has_rental_income && <span className="badge-purple">Rental income</span>}
                  {booking.has_prior_year_issues && <span className="badge-purple">Prior-year issues</span>}
                  {!booking.has_business_income && !booking.has_investments && !booking.has_rental_income && !booking.has_prior_year_issues && <span className="text-brand-slate">No special flags</span>}
                </div>
              </div>
              {booking.additional_context && (
                <div className="col-span-2"><p className="text-xs text-brand-slate uppercase">Additional Context</p><p className="text-brand-dark mt-1">{booking.additional_context}</p></div>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="border-t border-gray-100 pt-5">
            <h2 className="font-bold text-brand-dark flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-brand-purple" /> Payment
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <span className={cn('badge', booking.payment_status === 'paid' ? 'badge-success' : 'badge-slate')}>{booking.payment_status}</span>
              <span className="text-brand-slate">Amount paid: ${booking.amount_paid_cents / 100}</span>
            </div>
          </div>

          {/* Admin notes */}
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-brand-dark">Admin Notes</h2>
              {savedMsg && <span className="text-xs text-brand-success flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Saved</span>}
            </div>
            <textarea rows={3} className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes about this booking..." />
            <button onClick={handleSave} disabled={saving} className="btn-outline btn-sm mt-3">
              <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>

        {/* Sidebar actions */}
        <div className="space-y-4">
          <div className="card card-pad">
            <h3 className="font-bold text-brand-dark mb-3">Actions</h3>
            <div className="space-y-2">
              <a href={`mailto:${client?.email}?subject=Your appointment — ${booking.service_name}`} className="btn-outline btn-sm w-full">
                <Mail className="h-4 w-4" /> Email Client
              </a>
              <button
                onClick={() => handleStatusChange('cancelled')}
                disabled={status === 'cancelled'}
                className="btn-ghost btn-sm w-full text-brand-error"
              >
                <Ban className="h-4 w-4" /> Cancel Booking
              </button>
            </div>
          </div>

          <div className="card card-pad">
            <h3 className="font-bold text-brand-dark mb-3">Metadata</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-brand-slate">Created</dt><dd className="font-medium text-brand-dark">{formatShortDate(booking.created_at)}</dd></div>
              <div className="flex justify-between"><dt className="text-brand-slate">Source</dt><dd className="font-medium text-brand-dark">{booking.source}</dd></div>
              {booking.google_calendar_event_id && <div className="flex justify-between"><dt className="text-brand-slate">GCal Event</dt><dd className="font-medium text-brand-success">Synced</dd></div>}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
