import { useEffect, useState } from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchEmailLogs } from './adminData';
import { formatShortDate, cn, relativeTime } from '../lib/utils';

export default function AdminEmails() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [templateFilter, setTemplateFilter] = useState('');

  useEffect(() => {
    fetchEmailLogs()
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  const templates = Array.from(new Set(logs.map((l) => l.template_name)));
  const filtered = templateFilter ? logs.filter((l) => l.template_name === templateFilter) : logs;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-brand-dark">Email Log</h1>
        <select className="input w-auto" value={templateFilter} onChange={(e) => setTemplateFilter(e.target.value)}>
          <option value="">All templates</option>
          {templates.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-brand-slate">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-brand-slate">No emails sent yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Sent</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Recipient</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Template</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Subject</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-brand-slate text-xs">
                      {formatShortDate(l.sent_at)}<br />
                      <span className="text-[10px]">{relativeTime(l.sent_at)}</span>
                    </td>
                    <td className="px-4 py-3 text-brand-dark">{l.recipient_email}</td>
                    <td className="px-4 py-3 text-brand-slate text-xs">{l.template_name}</td>
                    <td className="px-4 py-3 text-brand-slate">{l.subject}</td>
                    <td className="px-4 py-3">
                      <span className={cn('badge', l.status === 'sent' ? 'badge-success' : l.status === 'failed' ? 'badge-error' : 'badge-slate')}>
                        {l.status === 'sent' ? <CheckCircle2 className="h-3 w-3" /> : l.status === 'failed' ? <AlertCircle className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                        {l.status}
                      </span>
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
