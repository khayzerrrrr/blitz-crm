'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { School, MapPin, GitBranch, TrendingUp, Target, Calendar, Plus, Phone, MessageCircle, FileSignature, MapPinCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role || 'SALES';
  const [stats, setStats] = useState({ schools: 0, visits: 0, pipeline: 0, won: 0 });
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

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

  const KPI_DATA = [
    { key: 'schools', label: 'Schools', value: stats.schools, icon: School, color: 'text-brand-500', bg: 'bg-brand-50', change: '+12%', trend: [4,6,5,7,8,6,9] },
    { key: 'visits', label: "Today's Visits", value: stats.visits, icon: MapPin, color: 'text-info', bg: 'bg-blue-50', change: '+3%', trend: [2,3,2,4,3,5,4] },
    { key: 'pipeline', label: 'Active Pipeline', value: stats.pipeline, icon: GitBranch, color: 'text-success', bg: 'bg-green-50', change: '+18%', trend: [7,5,8,6,9,7,10] },
    { key: 'won', label: 'Closed Won', value: stats.won, icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50', change: '0%', trend: [1,0,2,1,0,1,2] },
  ];

  const QUICK_ACTIONS = [
    { label: 'New Visit', icon: MapPinPlus, color: 'bg-brand-500', onClick: () => router.push('/visits/new') },
    { label: 'Check In', icon: MapPinCheck, color: 'bg-emerald-500', onClick: () => router.push('/visits') },
    { label: 'Call', icon: Phone, color: 'bg-blue-500', onClick: () => {} },
    { label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500', onClick: () => {} },
    { label: 'Proposal', icon: FileSignature, color: 'bg-violet-500', onClick: () => router.push('/pipeline') },
    { label: 'Schedule', icon: Calendar, color: 'bg-amber-500', onClick: () => router.push('/calendar') },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Good morning, {session?.user?.name?.split(' ')[0] || 'User'}</h1>
          <p className="text-sm text-surface-400 mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-brand-50 text-brand-600 font-medium">{role}</span>
          <span className="text-xs px-3 py-1.5 rounded-full bg-surface-100 text-surface-500">72% of monthly target</span>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-5 text-white shadow-lg">
        <p className="text-sm opacity-90">
          You have <strong>5 follow-ups</strong>, <strong>3 school visits</strong>, and <strong>2 proposals</strong> due today.
          Your monthly target is <strong>72% completed</strong>.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map(({ label, value, icon: Icon, color, bg, change, trend }) => (
          <div key={label} className="bg-white rounded-xl border border-surface-200 p-5 hover:shadow-card-hover transition-all duration-200 cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className={`${bg} p-2.5 rounded-xl`}>
                <Icon size={18} className={color} />
              </div>
              <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-success' : 'text-surface-400'}`}>{change}</span>
            </div>
            <p className="text-2xl font-bold text-surface-900">{value}</p>
            <p className="text-xs text-surface-400 mt-1">{label}</p>
            <div className="mt-2 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend.map((v, i) => ({ v, i }))}>
                  <Bar dataKey="v" fill={color.replace('text-', 'rgba(') + ',0.2)'} radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-surface-900 mb-3">Quick Actions</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {QUICK_ACTIONS.map(({ label, icon: Icon, color, onClick }) => (
            <button key={label} onClick={onClick}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-surface-200 rounded-xl hover:shadow-card-hover transition-all text-sm font-medium text-surface-700 whitespace-nowrap shrink-0">
              <div className={`${color} p-1.5 rounded-lg`}>
                <Icon size={14} className="text-white" />
              </div>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Today's Schedule */}
        <div className="bg-white rounded-xl border border-surface-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-surface-900">Today's Schedule</h2>
            <button className="text-xs text-brand-500 font-medium hover:text-brand-600">View all</button>
          </div>
          <div className="space-y-3">
            {[
              { time: '09:00', title: 'SMA Negeri 1 Jakarta', type: 'Visit', color: 'bg-brand-500' },
              { time: '11:00', title: 'SMP Islam Al-Azhar', type: 'Follow-up', color: 'bg-amber-500' },
              { time: '14:00', title: 'SMK Bina Nusantara', type: 'Proposal', color: 'bg-violet-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 hover:bg-surface-100 transition-colors cursor-pointer">
                <div className="text-xs text-surface-400 font-medium w-12 shrink-0">{item.time}</div>
                <div className={`w-1 h-8 rounded-full ${item.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 truncate">{item.title}</p>
                  <p className="text-xs text-surface-400">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Pipeline Preview */}
        <div className="bg-white rounded-xl border border-surface-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-surface-900">Pipeline Overview</h2>
            <button onClick={() => router.push('/pipeline')} className="text-xs text-brand-500 font-medium hover:text-brand-600">View all</button>
          </div>
          <div className="space-y-2">
            {[
              { stage: 'Prospect', count: 4, value: 'Rp 0', color: 'bg-brand-500' },
              { stage: 'Visit Done', count: 2, value: 'Rp 0', color: 'bg-amber-500' },
              { stage: 'Proposal', count: 1, value: 'Rp 50M', color: 'bg-violet-500' },
              { stage: 'Won', count: 0, value: 'Rp 0', color: 'bg-success' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-50">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span className="text-sm text-surface-700">{s.stage}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-medium text-surface-900">{s.count} deals</span>
                  <span className="text-surface-400">{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Need this because lucide-react MapPinPlus isn't in the standard set
function MapPinPlus(props: any) { return <MapPin {...props} />; }
