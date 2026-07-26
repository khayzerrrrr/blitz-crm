'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const SchoolMap = dynamic(() => import('@/components/map/SchoolMap'), { ssr: false, loading: () => <div className="h-[400px] bg-slate-100 rounded-lg flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div> });

interface School {
  id: string; name: string; city: string | null; province: string | null;
  status: string; latitude: number | null; longitude: number | null;
  island?: { name: string }; assignedTo?: { name: string };
}

const STATUS_OPTIONS = ['', 'POTENTIAL', 'CONTACTED', 'VISITED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST'];
const STATUS_LABELS: Record<string, string> = { '': 'Semua', POTENTIAL: 'Potential', CONTACTED: 'Contacted', VISITED: 'Visited', PROPOSAL_SENT: 'Proposal', NEGOTIATION: 'Negotiation', WON: 'Won', LOST: 'Lost' };

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState({ total: 0 });

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
        setStats(prev => ({ ...prev, total: json.pagination?.total || 0 }));
      } catch {} finally { setLoading(false) }
    }
    load();
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sekolah</h1>
          <p className="text-sm text-slate-500">{stats.total} sekolah terdata</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input placeholder="Cari sekolah..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-white">
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardContent className="p-0">
            <SchoolMap schools={schools} />
          </CardContent>
        </Card>

        {/* School List */}
        <Card>
          <CardContent className="p-3 max-h-[450px] overflow-y-auto space-y-1">
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="animate-spin text-slate-400" /></div>
            ) : schools.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Belum ada sekolah</p>
            ) : schools.map(s => (
              <div key={s.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer">
                <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-slate-400">{s.city || '-'}</span>
                    <Badge variant="outline" className="text-[9px] px-1 py-0">{STATUS_LABELS[s.status] || s.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
