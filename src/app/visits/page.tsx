'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Loader2, Clock, CheckCircle2, Calendar, Plus } from 'lucide-react';
import Link from 'next/link';

interface Visit {
  id: string; status: string; checkInTime: string | null;
  createdAt: string; school?: { id: string; name: string; city: string | null };
}

const STATUS_STYLES: Record<string, string> = {
  planned: 'bg-blue-50 text-blue-700 border-blue-200',
  checked_in: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const STATUS_ICONS: Record<string, typeof Clock> = {
  planned: Clock,
  checked_in: MapPin,
  completed: CheckCircle2,
  cancelled: Clock,
};

const FILTERS = ['', 'planned', 'checked_in', 'completed'];

export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  useEffect(() => { loadVisits(); }, [filter]);

  const loadVisits = async () => {
    setLoading(true);
    try {
      const params = filter ? `?status=${filter}` : '';
      const res = await fetch(`/api/visits${params}`);
      const json = await res.json();
      setVisits(json.data || []);
    } catch {} finally { setLoading(false); }
  };

  const doCheckin = async (visitId: string) => {
    if (!navigator.geolocation) { alert('GPS not available'); return; }
    setCheckingIn(visitId);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(`/api/visits/${visitId}/checkin`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        });
        if (!res.ok) { const err = await res.json(); alert(err.error || 'Check-in failed'); }
        else loadVisits();
      } catch {} finally { setCheckingIn(null); }
    }, () => { alert('Failed to get location'); setCheckingIn(null); }, { enableHighAccuracy: true, timeout: 15000 });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-surface-900 tracking-tight">Visits</h1>
          <p className="text-sm text-surface-400 mt-0.5">{visits.length} total visits</p>
        </div>
        <Button asChild className="shadow-lg shadow-brand-500/20 rounded-xl" size="sm">
          <Link href="/visits/new"><Plus size={16} strokeWidth={2.5} />New Visit</Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5">
        {FILTERS.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-4 py-2 rounded-xl font-semibold border transition-all duration-200 ${
              filter === s
                ? 'bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/20'
                : 'glass-card text-surface-500 hover:text-surface-700'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Visit Cards */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : visits.length === 0 ? (
          <div className="text-center py-16">
            <div className="size-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <MapPin size={28} className="text-surface-300" />
            </div>
            <p className="text-base font-semibold text-surface-400">No visits yet</p>
            <p className="text-xs text-surface-300 mt-1">Start by creating a new visit</p>
            <Button variant="outline" size="sm" className="mt-4 rounded-xl" asChild>
              <Link href="/visits/new"><Plus size={14} className="mr-1" />New Visit</Link>
            </Button>
          </div>
        ) : visits.map((v, i) => {
          const school = v.school || {} as any;
          const StatusIcon = STATUS_ICONS[v.status] || Clock;
          return (
            <div
              key={v.id}
              className="glass-card rounded-2xl p-4 animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 min-w-0">
                  <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                    v.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                    v.status === 'checked_in' ? 'bg-amber-50 text-amber-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    <StatusIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-surface-800 truncate">{school.name || '--'}</p>
                    <p className="text-xs text-surface-400 mt-0.5">{school.city || ''}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-surface-400">
                      <span className="flex items-center gap-1"><Calendar size={11} />{new Date(v.createdAt).toLocaleDateString('id-ID')}</span>
                      {v.checkInTime && <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={11} />Checked in</span>}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[v.status] || ''}`}>
                  {v.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-surface-100/80">
                {v.status === 'planned' && (
                  <button
                    onClick={() => doCheckin(v.id)}
                    disabled={checkingIn === v.id}
                    className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 transition-all font-semibold shadow-sm shadow-brand-500/20"
                  >
                    {checkingIn === v.id ? <Loader2 size={12} className="animate-spin" /> : <MapPin size={12} />}
                    Check In
                  </button>
                )}
                {v.status === 'checked_in' && (
                  <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-medium">
                    <div className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                    In Progress
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
