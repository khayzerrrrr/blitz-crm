'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface Visit {
  id: string; status: string; checkInTime: string | null; checkInLat: number | null;
  createdAt: string; school?: { id: string; name: string; city: string | null; latitude: number | null; longitude: number | null };
  user?: { name: string };
}

const STATUS_STYLES: Record<string, string> = {
  planned: 'bg-blue-100 text-blue-700', checked_in: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-600',
};

export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);

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

  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) { alert('GPS tidak tersedia'); reject(); return; }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => { alert('Gagal dapat lokasi'); reject(); },
        { enableHighAccuracy: true, timeout: 15000 }
      );
    });
  };

  const doCheckin = async (visitId: string) => {
    setCheckingIn(visitId);
    try {
      const loc = await getLocation();
      const res = await fetch(`/api/visits/${visitId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loc),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Gagal check-in');
      } else {
        loadVisits();
      }
    } catch {} finally { setCheckingIn(null); setGps(null); }
  };

  const filters = ['', 'planned', 'checked_in', 'completed', 'cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Kunjungan</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {filters.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border whitespace-nowrap transition ${filter === s ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
            {s || 'Semua'}
          </button>
        ))}
      </div>

      {/* Visit list */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" /></div>
        ) : visits.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-slate-400"><MapPin size={32} className="mx-auto mb-2 opacity-50" /><p className="text-sm">Belum ada kunjungan</p></CardContent></Card>
        ) : visits.map(v => {
          const school = v.school || {};
          return (
            <Card key={v.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{school.name || '-'}</p>
                    <p className="text-xs text-slate-400">{school.city || ''}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                      <span>📅 {new Date(v.createdAt).toLocaleDateString('id-ID')}</span>
                      {v.checkInTime && <span>· ✅ {new Date(v.checkInTime).toLocaleTimeString('id-ID')}</span>}
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${STATUS_STYLES[v.status] || ''}`}>{v.status}</Badge>
                </div>

                <div className="flex gap-1.5 mt-3 pt-2 border-t border-slate-100">
                  {v.status === 'planned' && (
                    <Button size="sm" variant="outline" onClick={() => doCheckin(v.id)} disabled={checkingIn === v.id}
                      className="text-xs text-amber-600 border-amber-300 hover:bg-amber-50">
                      {checkingIn === v.id ? <Loader2 size={12} className="animate-spin mr-1" /> : <MapPin size={12} className="mr-1" />}
                      Check-in
                    </Button>
                  )}
                  {v.status === 'checked_in' && (
                    <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700">Sedang check-in</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
