'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';

export default function VisitsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kunjungan</h1>
          <p className="text-sm text-slate-500">Field visit & survey</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600"><Plus size={16} /> Kunjungan Baru</Button>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-slate-500">Hari Ini</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">0</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-slate-500">Bulan Ini</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">0</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-slate-500">Check-in Aktif</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-emerald-600">0</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Riwayat Kunjungan</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-400">
            <MapPin size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada kunjungan</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
