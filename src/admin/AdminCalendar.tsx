import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar as CalIcon, Clock } from 'lucide-react';
import { fetchBookings, fetchAvailabilitySchedule, fetchOverrides, updateAvailabilitySchedule, addOverride, deleteOverride } from './adminData';
import { formatTime, cn, toLocalDateKey, isSameDay } from '../lib/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function AdminCalendar() {
  const [tab, setTab] = useState<'bookings' | 'availability'>('bookings');
  const [monthCursor, setMonthCursor] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [overrides, setOverrides] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchBookings(), fetchAvailabilitySchedule(), fetchOverrides()])
      .then(([b, s, o]) => {
        setBookings(b);
        setSchedule(s);
        setOverrides(o);
        setLoading(false);
      });
  }, []);

  // Bookings tab
  const monthStart = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
  const monthEnd = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0);
  const startPad = monthStart.getDay();
  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) calendarDays.push(null);
  for (let d = 1; d <= monthEnd.getDate(); d++) calendarDays.push(new Date(monthCursor.getFullYear(), monthCursor.getMonth(), d));

  const bookingsByDay = new Map<string, any[]>();
  bookings.forEach((b) => {
    if (b.status === 'cancelled') return;
    const key = toLocalDateKey(new Date(b.appointment_start));
    if (!bookingsByDay.has(key)) bookingsByDay.set(key, []);
    bookingsByDay.get(key)!.push(b);
  });

  // Availability tab
  const handleScheduleToggle = async (id: string, field: string, value: any) => {
    setSchedule((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    await updateAvailabilitySchedule(id, { [field]: value });
  };

  const [newOverride, setNewOverride] = useState({ override_date: '', is_blocked: true, reason: '' });

  const handleAddOverride = async () => {
    if (!newOverride.override_date) return;
    await addOverride({
      override_date: newOverride.override_date,
      is_blocked: newOverride.is_blocked,
      reason: newOverride.reason || null,
    });
    setOverrides(await fetchOverrides());
    setNewOverride({ override_date: '', is_blocked: true, reason: '' });
  };

  const handleDeleteOverride = async (id: string) => {
    await deleteOverride(id);
    setOverrides(await fetchOverrides());
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">Calendar</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {[
          { key: 'bookings', label: 'View Bookings' },
          { key: 'availability', label: 'Manage Availability' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={cn(
              'px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors',
              tab === t.key ? 'border-brand-purple text-brand-purple' : 'border-transparent text-brand-slate hover:text-brand-dark',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div>
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-dark">{MONTHS[monthCursor.getMonth()]} {monthCursor.getFullYear()}</h2>
            <div className="flex gap-2">
              <button onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))} className="btn-ghost btn-sm"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={() => setMonthCursor(new Date())} className="btn-ghost btn-sm text-xs">Today</button>
              <button onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))} className="btn-ghost btn-sm"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="card overflow-hidden">
            <div className="grid grid-cols-7 border-b border-gray-100">
              {DAYS.map((d) => <div key={d} className="text-center text-xs font-semibold text-brand-slate py-2 bg-gray-50">{d}</div>)}
            </div>
            <div className="grid grid-cols-7">
              {calendarDays.map((date, i) => {
                if (!date) return <div key={i} className="min-h-[100px] border-r border-b border-gray-50 bg-gray-50/50" />;
                const dayBookings = bookingsByDay.get(toLocalDateKey(date)) ?? [];
                const isToday = isSameDay(date, new Date());
                return (
                  <div key={i} className="min-h-[100px] border-r border-b border-gray-50 p-1.5">
                    <p className={cn('text-xs font-semibold mb-1', isToday ? 'text-brand-purple' : 'text-brand-slate')}>{date.getDate()}</p>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 3).map((b) => (
                        <Link key={b.id} to={`/admin/bookings/${b.id}`} className="block rounded bg-brand-purple-light px-1.5 py-1 text-[10px] font-medium text-brand-purple hover:bg-brand-purple hover:text-white transition-colors truncate">
                          {formatTime(b.appointment_start)} {b.clients?.full_name?.split(' ')[0]}
                        </Link>
                      ))}
                      {dayBookings.length > 3 && <p className="text-[10px] text-brand-slate pl-1">+{dayBookings.length - 3} more</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'availability' && (
        <div className="space-y-6">
          {/* Weekly schedule */}
          <div className="card card-pad">
            <h2 className="font-bold text-brand-dark flex items-center gap-2 mb-4">
              <CalIcon className="h-5 w-5 text-brand-purple" /> Weekly Availability
            </h2>
            <div className="space-y-2">
              {schedule.map((s) => (
                <div key={s.id} className="flex items-center gap-4 rounded-lg border border-gray-100 p-3">
                  <span className="w-24 font-semibold text-sm text-brand-dark">{DAYS[s.day_of_week]}</span>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={s.is_active} onChange={(e) => handleScheduleToggle(s.id, 'is_active', e.target.checked)} className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple" />
                    Active
                  </label>
                  {s.is_active && (
                    <div className="flex items-center gap-2 text-sm">
                      <input type="time" value={s.start_time} onChange={(e) => handleScheduleToggle(s.id, 'start_time', e.target.value)} className="input py-1.5 w-auto" />
                      <span className="text-brand-slate">to</span>
                      <input type="time" value={s.end_time} onChange={(e) => handleScheduleToggle(s.id, 'end_time', e.target.value)} className="input py-1.5 w-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Overrides */}
          <div className="card card-pad">
            <h2 className="font-bold text-brand-dark flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-brand-purple" /> Date Overrides
            </h2>
            <div className="flex flex-wrap items-end gap-3 mb-4 pb-4 border-b border-gray-100">
              <div>
                <label className="label">Date</label>
                <input type="date" className="input w-auto" value={newOverride.override_date} onChange={(e) => setNewOverride({ ...newOverride, override_date: e.target.value })} />
              </div>
              <div>
                <label className="label">Type</label>
                <select className="input w-auto" value={newOverride.is_blocked ? 'blocked' : 'custom'} onChange={(e) => setNewOverride({ ...newOverride, is_blocked: e.target.value === 'blocked' })}>
                  <option value="blocked">Block full day</option>
                </select>
              </div>
              <div>
                <label className="label">Reason</label>
                <input className="input w-48" placeholder="Vacation, holiday..." value={newOverride.reason} onChange={(e) => setNewOverride({ ...newOverride, reason: e.target.value })} />
              </div>
              <button onClick={handleAddOverride} className="btn-purple btn-sm"><Plus className="h-4 w-4" /> Add Override</button>
            </div>

            {overrides.length === 0 ? (
              <p className="text-sm text-brand-slate">No overrides set.</p>
            ) : (
              <ul className="space-y-2">
                {overrides.map((o) => (
                  <li key={o.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                    <div>
                      <p className="font-semibold text-sm text-brand-dark">{new Date(o.override_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      {o.reason && <p className="text-xs text-brand-slate">{o.reason}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={o.is_blocked ? 'badge-error' : 'badge-gold'}>{o.is_blocked ? 'Blocked' : 'Custom'}</span>
                      <button onClick={() => handleDeleteOverride(o.id)} className="btn-ghost btn-sm text-brand-error"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
