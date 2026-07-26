'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = session?.user?.role || 'SALES';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Halo, {session?.user?.name || 'User'}!</p>
        </div>
        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">{role}</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sekolah', value: '0', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Kunjungan Bulan Ini', value: '0', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pipeline Aktif', value: '0', color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Closed Won', value: '0', color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role-specific sections */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Aktivitas Terbaru</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 text-center py-8">Belum ada aktivitas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Pipeline Overview</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 text-center py-8">Belum ada data pipeline</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
