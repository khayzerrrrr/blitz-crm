'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  School, MapPin, GitBranch, TrendingUp, Plus, ArrowRight,
  Sparkles, Target, CheckCircle2, DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getGreeting, formatNumber, PIPELINE_STAGES, MAX_PIPELINE } from '@/lib/utils';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role || 'SALES';
  const [stats, setStats] = useState({ visits: 0, won: 0, revenue: 0 });
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const greeting = getGreeting();
  const firstName = session?.user?.name?.split(' ')[0] || 'User';

  useEffect(() => {
    async function load() {
      try {
        const [oppRes, vRes] = await Promise.all([
          fetch('/api/opportunities').then(r => r.json()),
          fetch('/api/visits?per_page=5').then(r => r.json()),
        ]);
        const opps = oppRes?.data || oppRes || [];
        const visits = vRes?.data || vRes || [];

        setPipelineData(opps);
        setRecentVisits(visits.slice(0, 5));
        setStats({
          visits: visits.length || 0,
          won: opps.filter((o: any) => o.stage === 'MOU').length || 0,
          revenue: opps.filter((o: any) => o.stage === 'MOU').reduce((s: number, o: any) => s + (o.value || 0), 0),
        });
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  const activeCount = pipelineData.filter((o: any) =>
    o.stage !== 'MOU' && o.stage !== 'NOT_THIS_TIME'
  ).length;

  const stageCounts = PIPELINE_STAGES.map(s => ({
    ...s,
    count: pipelineData.filter((o: any) => o.stage === s.key).length,
  })).filter(s => s.count > 0);

  const KPI = [
    { label: 'Active Pipeline', value: activeCount, sub: `max ${MAX_PIPELINE}`, icon: Target, gradient: 'from-brand-500 to-brand-600', accent: 'bg-brand-50 text-brand-600' },
    { label: 'Total Visits', value: stats.visits, icon: MapPin, gradient: 'from-accent-500 to-accent-600', accent: 'bg-accent-50 text-accent-600' },
    { label: 'Won Deals', value: stats.won, icon: CheckCircle2, gradient: 'from-success-500 to-success-600', accent: 'bg-success-50 text-success-600' },
    { label: 'Revenue', value: stats.revenue > 0 ? `Rp ${formatNumber(stats.revenue)}` : 'Rp 0', icon: DollarSign, gradient: 'from-navy-500 to-navy-700', accent: 'bg-navy-50 text-navy-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-surface-900 tracking-tight">
            {greeting}, {firstName}
          </h1>
          <p className="text-sm text-surface-400 mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="brand" className="px-3 py-1.5 text-xs font-semibold rounded-lg">
            {role === 'SALES' ? 'Marketing' : role}
          </Badge>
          <div className="flex items-center gap-2 text-xs text-surface-400">
            <div className="h-1.5 w-20 rounded-full bg-surface-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-700"
                style={{ width: `${Math.min((activeCount / MAX_PIPELINE) * 100, 100)}%` }}
              />
            </div>
            <span className="font-semibold text-surface-500">{activeCount}/{MAX_PIPELINE}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map(({ label, value, sub, icon: Icon, gradient, accent }, i) => (
          <div
            key={label}
            className="glass-card rounded-2xl p-5 cursor-pointer group animate-slide-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-2xl font-extrabold text-surface-900 tracking-tight">{String(value)}</p>
                <p className="text-xs text-surface-400 font-medium">{label}</p>
                {sub && <p className="text-[10px] text-surface-300">{sub}</p>}
              </div>
              <div className={`size-10 rounded-xl ${accent} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={18} strokeWidth={2} />
              </div>
            </div>
            {/* Subtle gradient line at bottom */}
            <div className={`mt-3 h-0.5 rounded-full bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </div>
        ))}
      </div>

      {/* Two Column */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pipeline Overview */}
        <div className="lg:col-span-2 animate-slide-up stagger-1">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-surface-900">Pipeline Overview</h2>
                <p className="text-xs text-surface-400 mt-0.5">Distribution by stage</p>
              </div>
              <Button variant="ghost" size="sm" className="text-brand-500 hover:text-brand-600 hover:bg-brand-50 text-xs" asChild>
                <Link href="/pipeline">View all <ArrowRight size={13} className="ml-1" /></Link>
              </Button>
            </div>

            {stageCounts.length === 0 ? (
              <div className="text-center py-10">
                <div className="size-14 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={24} className="text-surface-300" />
                </div>
                <p className="text-sm font-medium text-surface-400">No pipeline data yet</p>
                <Button variant="outline" size="sm" className="mt-3 rounded-xl" asChild>
                  <Link href="/pipeline"><Plus size={14} className="mr-1" />Start Pipeline</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {stageCounts.map(({ key, label, count, dot, text }) => (
                  <div
                    key={key}
                    onClick={() => router.push('/pipeline')}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-50/80 hover:bg-surface-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-2.5 rounded-full ${dot} ring-2 ring-offset-1 ${dot.replace('bg-', 'ring-')}/20`} />
                      <span className={`text-sm font-medium ${text}`}>{label}</span>
                    </div>
                    <span className="text-sm font-bold text-surface-700 tabular-nums">{count}</span>
                  </div>
                ))}
                {/* Progress bar */}
                <div className="mt-3 pt-3 border-t border-surface-100">
                  <div className="flex h-2 rounded-full overflow-hidden bg-surface-100">
                    {stageCounts.map(s => (
                      <div
                        key={s.key}
                        className={`${s.dot} transition-all duration-700`}
                        style={{ width: `${Math.max((s.count / pipelineData.length) * 100, 2)}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Visits */}
        <div className="animate-slide-up stagger-2">
          <div className="glass-card rounded-2xl p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-surface-900">Recent Visits</h2>
                <p className="text-xs text-surface-400 mt-0.5">Latest activity</p>
              </div>
              <Button variant="ghost" size="sm" className="text-brand-500 hover:text-brand-600 text-xs" asChild>
                <Link href="/visits">View all</Link>
              </Button>
            </div>

            {recentVisits.length === 0 ? (
              <div className="text-center py-10">
                <div className="size-14 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-3">
                  <MapPin size={24} className="text-surface-300" />
                </div>
                <p className="text-sm text-surface-400">No visits yet</p>
                <Button variant="outline" size="sm" className="mt-3 rounded-xl" asChild>
                  <Link href="/visits/new"><Plus size={14} className="mr-1" />New Visit</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {recentVisits.map((v: any, i: number) => (
                  <div key={v.id || i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50/80 hover:bg-surface-100 transition-all cursor-pointer">
                    <div className={`size-2.5 rounded-full ${
                      v.status === 'checked_in' ? 'bg-amber-400' :
                      v.status === 'completed' ? 'bg-success-500' :
                      'bg-surface-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-800 truncate">{v.school?.name || 'Unknown'}</p>
                      <p className="text-[11px] text-surface-400">{v.school?.city || ''}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full">{v.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="animate-slide-up stagger-3">
        <h2 className="text-sm font-bold text-surface-700 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: 'New Visit', href: '/visits/new', icon: Plus, gradient: 'from-brand-500 to-brand-600' },
            { label: 'Check In', href: '/visits', icon: MapPin, gradient: 'from-emerald-500 to-teal-600' },
            { label: 'Pipeline', href: '/pipeline', icon: GitBranch, gradient: 'from-accent-500 to-accent-600' },
            { label: 'Schools', href: '/schools', icon: School, gradient: 'from-navy-500 to-navy-700' },
            { label: 'Revenue', href: '/revenue', icon: DollarSign, gradient: 'from-violet-500 to-purple-600' },
            { label: 'Users', href: '/users', icon: TrendingUp, gradient: 'from-slate-500 to-slate-700' },
          ].map(({ label, href, icon: Icon, gradient }, i) => (
            <Link
              key={label}
              href={href}
              className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center group hover:-translate-y-1"
              style={{ animationDelay: `${0.2 + i * 0.04}s` }}
            >
              <div className={`size-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-semibold text-surface-600">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
