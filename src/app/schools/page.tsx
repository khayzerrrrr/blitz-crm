'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, School, Loader2, SlidersHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';

const SchoolMap = dynamic(() => import('@/components/map/SchoolMap'), { ssr: false, loading: () => <div className="h-[400px] bg-surface-100 rounded-xl flex items-center justify-center"><Loader2 className="animate-spin text-surface-400" /></div> });

interface SchoolItem {
  id: string; name: string; city: string | null; status: string; latitude: number | null; longitude: number | null;
  island?: { name: string }; assignedTo?: { name: string };
}

const STATUS_OPTIONS = ['', 'POTENTIAL', 'CONTACTED', 'VISITED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST'];
const STATUS_LABELS: Record<string, string> = { '': 'All', POTENTIAL: 'Potential', CONTACTED: 'Contacted', VISITED: 'Visited', PROPOSAL_SENT: 'Proposal', NEGOTIATION: 'Negotiation', WON: 'Won', LOST: 'Lost' };
const STATUS_COLORS: Record<string, string> = { POTENTIAL: 'bg-surface-200 text-surface-600', CONTACTED: 'bg-blue-100 text-blue-700', VISITED: 'bg-amber-100 text-amber-700', PROPOSAL_SENT: 'bg-violet-100 text-violet-700', NEGOTIATION: 'bg-orange-100 text-orange-700', WON: 'bg-green-100 text-green-700', LOST: 'bg-red-100 text-red-600' };

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);
        params.set('per_page', '100');
        const res = await fetch(`/api/schools?${params}`);
        const json = await res.json();
        setSchools(json.data || []);
        setTotal(json.pagination?.total || 0);
      } catch {} finally { setLoading(false) }
    }
    load();
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Schools</h1>
          <p className="text-sm text-surface-400 mt-0.5">{total} total schools</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
          <Input placeholder="Search schools..." className="pl-9 bg-white border-surface-200" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-surface-200 rounded-xl px-3 py-2">
          <SlidersHorizontal size={14} className="text-surface-400" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm bg-transparent border-none outline-none text-surface-600">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 overflow-hidden border-surface-200 shadow-card">
          <CardContent className="p-0"><SchoolMap schools={schools} /></CardContent>
        </Card>

        <div className="bg-white rounded-xl border border-surface-200 shadow-card max-h-[450px] overflow-y-auto">
          <div className="p-3 border-b border-surface-100">
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">School List</p>
          </div>
          <div className="p-2 space-y-0.5">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-surface-400" /></div>
            ) : schools.length === 0 ? (
              <p className="text-sm text-surface-400 text-center py-8">No schools found</p>
            ) : schools.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-50 transition cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center shrink-0">
                  <School size={14} className="text-surface-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-surface-900 truncate">{s.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-surface-400">{s.city || '—'}</span>
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-medium ${STATUS_COLORS[s.status] || 'bg-surface-100 text-surface-500'}`}>{STATUS_LABELS[s.status] || s.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
