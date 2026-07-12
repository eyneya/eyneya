import { useEffect, useState } from 'react';
import { Mail, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import { fetchContactSubmissions, updateContactStatus } from './adminData';
import { relativeTime, cn } from '../lib/utils';

export default function AdminContact() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchContactSubmissions()
      .then(setSubmissions)
      .finally(() => setLoading(false));
  }, []);

  const filtered = statusFilter === 'all' ? submissions : submissions.filter((s) => s.status === statusFilter);

  const handleStatus = async (id: string, status: string) => {
    await updateContactStatus(id, status);
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const unreadCount = submissions.filter((s) => s.status === 'new').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-brand-dark">Contact Submissions {unreadCount > 0 && <span className="badge-gold ml-2">{unreadCount} new</span>}</h1>
        <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="responded">Responded</option>
        </select>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-brand-slate">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center text-brand-slate">No submissions found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="card card-pad">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-brand-dark">{s.full_name}</h3>
                    <span className={cn('badge text-[10px]', s.status === 'new' ? 'badge-gold' : s.status === 'responded' ? 'badge-success' : 'badge-slate')}>{s.status}</span>
                    <span className="text-xs text-brand-slate">{relativeTime(s.created_at)}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-slate">
                    <a href={`mailto:${s.email}`} className="flex items-center gap-1.5 hover:text-brand-purple"><Mail className="h-3.5 w-3.5" /> {s.email}</a>
                    {s.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {s.phone}</span>}
                    {s.service_interest && <span className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> {s.service_interest}</span>}
                  </div>
                  <p className="mt-3 text-sm text-brand-dark bg-gray-50 rounded-lg p-3">{s.message}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <a href={`mailto:${s.email}?subject=Re: Your inquiry to Eyneya Business Solutions`} className="btn-outline btn-sm">
                    <ExternalLink className="h-4 w-4" /> Reply
                  </a>
                  {s.status === 'new' && (
                    <button onClick={() => handleStatus(s.id, 'reviewed')} className="btn-ghost btn-sm">Mark reviewed</button>
                  )}
                  {s.status !== 'responded' && (
                    <button onClick={() => handleStatus(s.id, 'responded')} className="btn-ghost btn-sm text-brand-success">Mark responded</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
