'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role || 'SALES';
  const [stats, setStats] = useState({ schools: 0, visits: 0, pipeline: 0, won: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [schoolsRes, visitsRes] = await Promise.all([
          fetch('/api/schools?per_page=1').then(r => r.json()),
          fetch('/api/visits?per_page=1').then(r => r.json()),
        ]);
        setStats({
          schools: schoolsRes.pagination?.total || 0,
          visits: visitsRes.pagination?.total || 0,
          pipeline: 0,
          won: 0,
        });
      } catch {}
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Halo, {session?.user?.name || 'User'}!</p>
        </div>
        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">{role}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sekolah" value={stats.schools} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Kunjungan" value={stats.visits} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Pipeline Aktif" value={stats.pipeline} color="text-orange-600" bg="bg-orange-50" />
        <StatCard label="Closed Won" value={stats.won} color="text-violet-600" bg="bg-violet-50" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Akses Cepat</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <QuickButton label="Sekolah" href="/schools" color="bg-blue-500" onClick={() => router.push('/schools')} />
              <QuickButton label="Kunjungan" href="/visits" color="bg-emerald-500" onClick={() => router.push('/visits')} />
              <QuickButton label="Pipeline" href="/pipeline" color="bg-orange-500" onClick={() => router.push('/pipeline')} />
              <QuickButton label="Users" href="/users" color="bg-slate-500" onClick={() => router.push('/users')} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Info Akun</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><span className="text-slate-500">Nama:</span> {session?.user?.name}</p>
            <p><span className="text-slate-500">Email:</span> {session?.user?.email}</p>
            <p><span className="text-slate-500">Role:</span> {session?.user?.role}</p>
            {session?.user?.island && <p><span className="text-slate-500">Pulau:</span> {session.user.island}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function QuickButton({ label, color, onClick }: { label: string; href: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`${color} text-white p-3 rounded-xl text-sm font-semibold hover:opacity-90 transition text-center`}>
      {label}
    </button>
  );
}
