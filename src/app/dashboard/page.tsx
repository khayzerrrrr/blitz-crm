'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role || 'SALES';
  const [stats, setStats] = useState({ schools: 0, visits: 0, pipeline: 0, won: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [sRes, vRes] = await Promise.all([
          fetch('/api/schools?per_page=1').then(r => r.json()),
          fetch('/api/visits?per_page=1').then(r => r.json()),
        ]);
        setStats({
          schools: sRes.pagination?.total || 0,
          visits: vRes.pagination?.total || 0,
          pipeline: 0, won: 0,
        });
      } catch {}
    }
    load();
  }, []);

  const chartData = [
    { name: 'Sekolah', value: stats.schools, fill: '#3B82F6' },
    { name: 'Kunjungan', value: stats.visits, fill: '#10B981' },
    { name: 'Pipeline', value: stats.pipeline, fill: '#F89029' },
    { name: 'Won', value: stats.won, fill: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Halo, {session?.user?.name || 'User'}!</p>
        </div>
        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">{role}</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Sekolah" value={stats.schools} color="text-blue-600" />
        <StatCard label="Kunjungan" value={stats.visits} color="text-emerald-600" />
        <StatCard label="Pipeline" value={stats.pipeline} color="text-orange-600" />
        <StatCard label="Closed Won" value={stats.won} color="text-violet-600" />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Overview</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <QuickBtn label="+ Kunjungan Baru" onClick={() => router.push('/visits/new')} color="bg-orange-500" />
        <QuickBtn label="Sekolah" onClick={() => router.push('/schools')} color="bg-blue-500" />
        <QuickBtn label="Pipeline" onClick={() => router.push('/pipeline')} color="bg-violet-500" />
        <QuickBtn label="Users" onClick={() => router.push('/users')} color="bg-slate-500" />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function QuickBtn({ label, onClick, color }: { label: string; onClick: () => void; color: string }) {
  return <button onClick={onClick} className={`${color} text-white p-3 rounded-xl text-sm font-semibold hover:opacity-90 transition`}>{label}</button>;
}
