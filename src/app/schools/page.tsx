'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, School, Loader2, MapPin, Building2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const SchoolMap = dynamic(() => import('@/components/map/SchoolMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[450px] bg-surface-50 rounded-2xl flex items-center justify-center">
      <Loader2 className="animate-spin text-surface-300" size={28} />
    </div>
  ),
});

interface SchoolItem {
  id: string; name: string; city: string | null; status: string;
  latitude: number | null; longitude: number | null;
  island?: { name: string }; assignedTo?: { name: string };
}

const STATUS_OPTIONS = ['', 'POTENTIAL', 'CONTACTED', 'VISITED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST'];
const STATUS_LABELS: Record<string, string> = {
  '': 'All Status', POTENTIAL: 'Potential', CONTACTED: 'Contacted', VISITED: 'Visited',
  PROPOSAL_SENT: 'Proposal', NEGOTIATION: 'Negotiation', WON: 'Won', LOST: 'Lost',
};
const STATUS_STYLES: Record<string, string> = {
  POTENTIAL: 'bg-surface-100 text-surface-600 border-surface-200',
  CONTACTED: 'bg-blue-50 text-blue-700 border-blue-200',
  VISITED: 'bg-amber-50 text-amber-700 border-amber-200',
  PROPOSAL_SENT: 'bg-violet-50 text-violet-700 border-violet-200',
  NEGOTIATION: 'bg-orange-50 text-orange-700 border-orange-200',
  WON: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  LOST: 'bg-red-50 text-red-600 border-red-200',
};

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
      } catch {} finally { setLoading(false); }
    }
    load();
  }, [search, statusFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-surface-900 tracking-tight">Schools</h1>
          <p className="text-sm text-surface-400 mt-0.5">{total} schools across 3 islands</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
          <Input
            placeholder="Search schools..."
            className="pl-10 glass-card rounded-xl h-10 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-[11px] px-3 py-2 rounded-lg font-semibold border transition-all duration-200 ${
                statusFilter === s
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/20'
                  : 'glass-card text-surface-500 hover:text-surface-700'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Map + List */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <SchoolMap schools={schools} />
        </div>

        <div className="glass-card rounded-2xl overflow-hidden max-h-[470px] flex flex-col">
          <div className="p-4 border-b border-surface-100/80 flex items-center gap-2">
            <Building2 size={16} className="text-surface-400" />
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wider">School List</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
            {loading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : schools.length === 0 ? (
              <div className="text-center py-12">
                <div className="size-14 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-3">
                  <School size={24} className="text-surface-300" />
                </div>
                <p className="text-sm text-surface-400">No schools found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {schools.map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50/80 transition-all cursor-pointer group">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center shrink-0 group-hover:from-brand-50 group-hover:to-brand-100 transition-all">
                      <School size={16} className="text-surface-400 group-hover:text-brand-500 transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-surface-800 truncate">{s.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {s.city && (
                          <span className="flex items-center gap-0.5 text-[11px] text-surface-400">
                            <MapPin size={10} /> {s.city}
                          </span>
                        )}
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-semibold border ${STATUS_STYLES[s.status] || 'bg-surface-100 text-surface-500'}`}>
                          {STATUS_LABELS[s.status] || s.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
