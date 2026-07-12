import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Building2, Bell, UserCog, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { cn } from '../lib/utils';

const TABS = [
  { key: 'business', label: 'Business', icon: Building2 },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'calendar', label: 'Calendar', icon: SettingsIcon },
  { key: 'account', label: 'Account', icon: UserCog },
];

export default function AdminSettings() {
  const [tab, setTab] = useState('business');
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    supabase.from('admin_settings').select('*').then(({ data }) => {
      const map: Record<string, any> = {};
      (data ?? []).forEach((r: any) => (map[r.key] = typeof r.value === 'string' ? JSON.parse(r.value) : r.value));
      setSettings(map);
      setLoading(false);
    });
  }, []);

  const saveSetting = async (key: string, value: any) => {
    await supabase.from('admin_settings').upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="animate-pulse text-brand-slate">Loading settings...</div>;

  const business = settings.business_info ?? { name: '', phone: '', email: '', city: '', state: '', address: '' };
  const notifications = settings.notifications ?? { admin_email: '', new_booking: true, new_contact: true, new_application: true, payment_received: true };
  const reminders = settings.appointment_reminder_hours ?? [24, 1];
  const maxAhead = settings.max_booking_days_ahead ?? 30;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap',
              tab === t.key ? 'border-brand-purple text-brand-purple' : 'border-transparent text-brand-slate hover:text-brand-dark',
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {saved && (
        <div className="card card-pad bg-emerald-50 border-emerald-200 flex items-center gap-2 text-brand-success">
          <CheckCircle2 className="h-5 w-5" /> Settings saved
        </div>
      )}

      {tab === 'business' && (
        <div className="card card-pad max-w-2xl space-y-4">
          <h2 className="font-bold text-brand-dark">Business Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Business Name</label><input className="input" defaultValue={business.name} onBlur={(e) => saveSetting('business_info', { ...business, name: e.target.value })} /></div>
            <div><label className="label">Phone</label><input className="input" defaultValue={business.phone} onBlur={(e) => saveSetting('business_info', { ...business, phone: e.target.value })} /></div>
            <div><label className="label">Email</label><input className="input" defaultValue={business.email} onBlur={(e) => saveSetting('business_info', { ...business, email: e.target.value })} /></div>
            <div><label className="label">City</label><input className="input" defaultValue={business.city} onBlur={(e) => saveSetting('business_info', { ...business, city: e.target.value })} /></div>
            <div><label className="label">State</label><input className="input" defaultValue={business.state} onBlur={(e) => saveSetting('business_info', { ...business, state: e.target.value })} /></div>
            <div><label className="label">Address</label><input className="input" defaultValue={business.address} onBlur={(e) => saveSetting('business_info', { ...business, address: e.target.value })} /></div>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="card card-pad max-w-2xl space-y-4">
          <h2 className="font-bold text-brand-dark">Notification Settings</h2>
          <div>
            <label className="label">Admin Notification Email</label>
            <input className="input" defaultValue={notifications.admin_email} onBlur={(e) => saveSetting('notifications', { ...notifications, admin_email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-brand-dark">Admin Alerts</p>
            {[
              { key: 'new_booking', label: 'New booking created' },
              { key: 'new_contact', label: 'New contact form submission' },
              { key: 'new_application', label: 'New advisory application' },
              { key: 'payment_received', label: 'Payment received' },
            ].map((c) => (
              <label key={c.key} className="flex items-center gap-2.5 text-sm text-brand-dark">
                <input
                  type="checkbox"
                  defaultChecked={notifications[c.key]}
                  className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                  onChange={(e) => saveSetting('notifications', { ...notifications, [c.key]: e.target.checked })}
                />
                {c.label}
              </label>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4">
            <label className="label">Reminder Schedule (hours before appointment)</label>
            <input
              className="input"
              defaultValue={reminders.join(', ')}
              onBlur={(e) => {
                const arr = e.target.value.split(',').map((s) => Number(s.trim())).filter((n) => !isNaN(n));
                saveSetting('appointment_reminder_hours', arr);
              }}
              placeholder="24, 1"
            />
            <p className="text-xs text-brand-slate mt-1">Comma-separated hours (e.g. 24, 1)</p>
          </div>
        </div>
      )}

      {tab === 'calendar' && (
        <div className="card card-pad max-w-2xl space-y-4">
          <h2 className="font-bold text-brand-dark">Calendar Settings</h2>
          <div>
            <label className="label">Maximum Days Ahead Bookable</label>
            <input type="number" className="input" defaultValue={maxAhead} onBlur={(e) => saveSetting('max_booking_days_ahead', Number(e.target.value))} />
          </div>
          <div className="rounded-lg bg-brand-purple-light p-4 border border-brand-purple/20">
            <h3 className="font-semibold text-brand-dark flex items-center gap-2">
              <SettingsIcon className="h-4 w-4 text-brand-purple" /> Google Calendar
            </h3>
            <p className="text-sm text-brand-slate mt-2">
              Google Calendar integration is available. Connect via the Calendar tab to sync appointments automatically.
            </p>
            <p className="text-xs text-brand-slate mt-2">Status: Not connected</p>
          </div>
        </div>
      )}

      {tab === 'account' && (
        <div className="space-y-4 max-w-2xl">
          <div className="card card-pad">
            <h2 className="font-bold text-brand-dark mb-4">Account</h2>
            <p className="text-sm text-brand-slate">Signed in as <strong className="text-brand-dark">{user?.email}</strong></p>
            <p className="text-xs text-brand-slate mt-2">To change your password, use the Supabase auth dashboard or contact your developer.</p>
          </div>
          <div className="card card-pad border-red-200">
            <h2 className="font-bold text-brand-error mb-2">Danger Zone</h2>
            <p className="text-sm text-brand-slate mb-4">Permanently delete all bookings, clients, and submissions. This cannot be undone.</p>
            <button className="btn-ghost text-brand-error border border-red-200 hover:bg-red-50" onClick={() => alert('Contact your developer to perform this action.')}>
              Clear All Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
