'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STAGES = [
  { key: 'NEW_PROSPECT', label: 'New Prospect', color: 'bg-slate-400' },
  { key: 'INITIAL_CONTACT', label: 'Initial Contact', color: 'bg-blue-400' },
  { key: 'SCHOOL_VISIT_DONE', label: 'School Visit Done', color: 'bg-orange-400' },
  { key: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'bg-violet-400' },
  { key: 'NEGOTIATION', label: 'Negotiation', color: 'bg-amber-400' },
  { key: 'CLOSED_WON', label: 'Closed Won', color: 'bg-emerald-400' },
  { key: 'CLOSED_LOST', label: 'Closed Lost', color: 'bg-red-400' },
];

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pipeline</h1>
          <p className="text-sm text-slate-500">Opportunity tracking</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600"><Plus size={16} /> Tambah Opportunity</Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <div key={stage.key} className="min-w-[220px] flex-shrink-0">
            <Card>
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <CardTitle className="text-xs font-semibold">{stage.label}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">0</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-1 space-y-2 min-h-[200px]">
                <div className="text-center py-8 text-slate-400">
                  <p className="text-xs">Belum ada</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
