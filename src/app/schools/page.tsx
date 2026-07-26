'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MapPin } from 'lucide-react';

export default function SchoolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sekolah</h1>
          <p className="text-sm text-slate-500">Data sekolah dan mapping</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600"><Plus size={16} /> Tambah Sekolah</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input placeholder="Cari sekolah..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="h-[400px] bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MapPin size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Map akan muncul di sini</p>
                <p className="text-xs mt-1">(React-Leaflet + OpenStreetMap)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Filter</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-500">Pulau</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
                <option>Semua</option>
                <option>Sumatra</option>
                <option>Jawa</option>
                <option>Bali</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Status</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
                <option>Semua</option>
                <option>Potential</option>
                <option>Contacted</option>
                <option>Visited</option>
                <option>Won</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
