import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { fetchClients } from './adminData';
import { formatShortDate } from '../lib/utils';

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchClients(search)
      .then(setClients)
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-brand-dark">Clients</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input className="input pl-9 w-64" placeholder="Search name, email, business..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-brand-slate">Loading...</div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-brand-slate">No clients found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Name</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Email</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Phone</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Business</th>
                  <th className="text-left font-semibold text-brand-dark px-4 py-3">Since</th>
                  <th className="text-right font-semibold text-brand-dark px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-brand-dark">{c.full_name}</td>
                    <td className="px-4 py-3 text-brand-slate">{c.email}</td>
                    <td className="px-4 py-3 text-brand-slate">{c.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-brand-slate">{c.business_name ?? '—'}</td>
                    <td className="px-4 py-3 text-brand-slate">{formatShortDate(c.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/clients/${c.id}`} className="text-sm font-semibold text-brand-purple hover:underline">View</Link>
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
