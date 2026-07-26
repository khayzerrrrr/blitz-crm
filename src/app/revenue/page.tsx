'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, DollarSign, Users, FileCheck } from 'lucide-react';
import { formatRupiah, formatNumber } from '@/lib/utils';

export default function RevenuePage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch('/api/opportunities?stage=MOU');
      const json = await res.json();
      const data = json.data || json || [];
      setDeals(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const totalRevenue = deals.reduce((s: number, d: any) => s + (d.value || 0), 0);
  const totalDeals = deals.length;
  const avgDealValue = totalDeals > 0 ? totalRevenue / totalDeals : 0;
  const estimatedCommission = totalRevenue * 0.10;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  const KPI = [
    { label: 'Total Revenue', value: formatRupiah(totalRevenue), icon: DollarSign, gradient: 'from-emerald-500 to-teal-600', accent: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Deals', value: formatNumber(totalDeals), icon: FileCheck, gradient: 'from-brand-500 to-brand-600', accent: 'bg-brand-50 text-brand-600' },
    { label: 'Avg Deal Value', value: formatRupiah(avgDealValue), icon: TrendingUp, gradient: 'from-accent-500 to-accent-600', accent: 'bg-accent-50 text-accent-600' },
    { label: 'Est. Commission', value: formatRupiah(estimatedCommission), sub: '10% rate', icon: Users, gradient: 'from-violet-500 to-purple-600', accent: 'bg-violet-50 text-violet-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-surface-900 tracking-tight">Revenue</h1>
        <p className="text-sm text-surface-400 mt-1">MOU deal revenue summary</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map(({ label, value, sub, icon: Icon, gradient, accent }, i) => (
          <div
            key={label}
            className="glass-card rounded-2xl p-5 group animate-slide-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <p className="text-xl font-extrabold text-surface-900 tracking-tight">{value}</p>
                <p className="text-xs text-surface-400 font-medium">{label}</p>
                {sub && <p className="text-[10px] text-surface-300">{sub}</p>}
              </div>
              <div className={`size-10 rounded-xl ${accent} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon size={18} />
              </div>
            </div>
            <div className={`mt-3 h-0.5 rounded-full bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </div>
        ))}
      </div>

      {/* Deals Table */}
      <div className="glass-card rounded-2xl overflow-hidden animate-slide-up stagger-1">
        <div className="p-5 border-b border-surface-100/80">
          <h2 className="text-base font-bold text-surface-900">MOU Deals</h2>
          <p className="text-xs text-surface-400 mt-0.5">All signed contracts</p>
        </div>

        {deals.length === 0 ? (
          <div className="text-center py-14">
            <div className="size-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <FileCheck size={28} className="text-surface-300" />
            </div>
            <p className="text-base font-semibold text-surface-400">No MOU deals yet</p>
            <p className="text-xs text-surface-300 mt-1 max-w-xs mx-auto">
              Deals will appear here once pipeline reaches MOU stage
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-100">
                  <th className="text-left py-3.5 px-5 text-[11px] font-bold text-surface-400 uppercase tracking-wider">School</th>
                  <th className="text-left py-3.5 px-5 text-[11px] font-bold text-surface-400 uppercase tracking-wider">Region</th>
                  <th className="text-right py-3.5 px-5 text-[11px] font-bold text-surface-400 uppercase tracking-wider">Deal Value</th>
                  <th className="text-right py-3.5 px-5 text-[11px] font-bold text-surface-400 uppercase tracking-wider">Commission</th>
                  <th className="text-center py-3.5 px-5 text-[11px] font-bold text-surface-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal: any) => (
                  <tr key={deal.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-surface-800">{deal.school?.name || '--'}</p>
                      <p className="text-xs text-surface-400">{deal.school?.city || ''}</p>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-surface-500">{deal.school?.island || '--'}</td>
                    <td className="py-3.5 px-5 text-right font-bold text-surface-800">
                      {formatRupiah(deal.value || 0)}
                    </td>
                    <td className="py-3.5 px-5 text-right text-xs text-emerald-600 font-bold">
                      {deal.value ? formatRupiah((deal.value * 0.10 / 36)) : '--'}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <Badge variant="success" className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
