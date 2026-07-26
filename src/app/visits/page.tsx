'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Loader2, Clock, CheckCircle2, Calendar } from 'lucide-react';

interface Visit {
  id: string; status: string; checkInTime: string | null;
  createdAt: string; school?: { id: string; name: string; city: string | null };
}

const STATUS_STYLES: Record<string, string> = {
  planned: 'bg-blue-100 text-blue-700', checked_in: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-600',
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
    } catch {} finally { setLoading(false) }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Visits</h1>
          <p className="text-sm text-surface-400 mt-0.5">{visits.length} total</p>
        </div>
      </div>

      <div className="flex gap-1.5 pb-1">
        {FILTERS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs px-3.5 py-2 rounded-full font-medium border transition-all ${
              filter === s ? 'bg-brand-500 text-white border-brand-500 shadow-sm' : 'bg-white border-surface-200 text-surface-500 hover:border-surface-300'
            }`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-surface-400" size={24} /></div>
        ) : visits.length === 0 ? (
          <div className="text-center py-16"><MapPin size={40} className="mx-auto mb-3 text-surface-300" /><p className="text-sm text-surface-400">No visits yet</p></div>
        ) : visits.map(v => {
          const school = v.school || {} as any;
          return (
            <div key={v.id} className="bg-white rounded-xl border border-surface-200 shadow-card p-4 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900 truncate">{school.name || '—'}</p>
                  <p className="text-xs text-surface-400 mt-0.5">{school.city || ''}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-surface-400">
                    <span className="flex items-center gap-1"><Calendar size={12} />{new Date(v.createdAt).toLocaleDateString('id-ID')}</span>
                    {v.checkInTime && <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-success" />Checked in</span>}
                  </div>
                </div>
                <Badge variant="outline" className={`text-[10px] font-medium ${STATUS_STYLES[v.status] || ''}`}>{v.status}</Badge>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-surface-100">
                {v.status === 'planned' && (
                  <button onClick={() => doCheckin(v.id)} disabled={checkingIn === v.id}
                    className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 transition-all font-medium shadow-sm">
                    {checkingIn === v.id ? <Loader2 size={12} className="animate-spin" /> : <MapPin size={12} />}
                    Check In
                  </button>
                )}
                {v.status === 'checked_in' && (
                  <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                    <Clock size={12} className="mr-1" /> In Progress
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

