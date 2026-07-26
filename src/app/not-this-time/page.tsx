'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw, MapPin, Clock } from 'lucide-react';

export default function NotThisTimePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reactivatingId, setReactivatingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch('/api/opportunities?stage=NOT_THIS_TIME');
      const json = await res.json();
      setItems(json.data || json || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleReactivate = async (id: string) => {
    setReactivatingId(id);
    try {
      // Reactivate back to last active stage (default to TARGET)
      await fetch(`/api/opportunities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: 'TARGET' }),
      });
      load();
    } catch {} finally { setReactivatingId(null); }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-surface-900 tracking-tight">Not This Time</h1>
        <p className="text-sm text-surface-400 mt-1">
          {items.length} sekolah yang ditunda atau ditolak. Data dan history tetap tersimpan.
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="size-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <Clock size={28} className="text-surface-400" />
            </div>
            <p className="text-base font-semibold text-surface-900">Tidak ada sekolah di daftar ini</p>
            <p className="text-xs text-surface-400 mt-1 max-w-xs mx-auto">
              Sekolah yang ditunda atau ditolak akan muncul di sini. Anda bisa mengaktifkannya kembali kapan saja.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((item: any) => (
            <Card key={item.id} className="hover:shadow-card-hover transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-danger-50 flex items-center justify-center">
                      <MapPin size={18} className="text-danger-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-surface-900">{item.school?.name || 'Unknown School'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-surface-400">{item.school?.city || '—'}</span>
                        <span className="text-surface-300">·</span>
                        <span className="text-xs text-surface-400">
                          Ditunda sejak {new Date(item.updatedAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReactivate(item.id)}
                    disabled={reactivatingId === item.id}
                  >
                    {reactivatingId === item.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RotateCcw size={14} />
                    )}
                    Aktifkan Kembali
                  </Button>
                </div>
                {item.value > 0 && (
                  <div className="mt-3 pt-3 border-t border-surface-100 flex items-center gap-4 text-xs text-surface-500">
                    <span>Nilai deal: <strong className="text-surface-700">Rp {new Intl.NumberFormat('id-ID').format(item.value)}</strong></span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
