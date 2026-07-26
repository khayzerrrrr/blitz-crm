'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Loader2, Search, Hash } from 'lucide-react';
import { PIPELINE_STAGES, formatNumber, MAX_PIPELINE } from '@/lib/utils';

const STAGE_KEYS = PIPELINE_STAGES.map(s => s.key);

export default function PipelinePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await fetch('/api/opportunities');
      const json = await res.json();
      setItems(json.data || json || []);
    } catch {} finally { setLoading(false); }
  };

  const grouped = STAGE_KEYS.reduce((acc: Record<string, any[]>, key) => {
    acc[key] = items.filter(i => i.stage === key);
    return acc;
  }, {} as Record<string, any[]>);

  const activeCount = items.filter((i: any) =>
    i.stage !== 'MOU' && i.stage !== 'NOT_THIS_TIME'
  ).length;

  const handleDragEnd = useCallback(async (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStage = destination.droppableId;
    setItems(prev => prev.map(i => i.id === draggableId ? { ...i, stage: newStage } : i));
    try {
      await fetch(`/api/opportunities/${draggableId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
    } catch { load(); }
  }, []);

  const openCreate = async () => {
    try {
      const res = await fetch('/api/schools?per_page=200');
      const json = await res.json();
      setSchools(json.data || json || []);
    } catch {}
    setShowModal(true);
  };

  const filteredSchools = schools.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-surface-900 tracking-tight">Pipeline</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-surface-400">{items.length} opportunities</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 rounded-full bg-surface-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-700"
                  style={{ width: `${Math.min((activeCount / MAX_PIPELINE) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs text-surface-400 font-semibold">{activeCount}/{MAX_PIPELINE}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={openCreate}
          disabled={activeCount >= MAX_PIPELINE}
          className="shadow-lg shadow-brand-500/20 rounded-xl"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Opportunity
        </Button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin" style={{ minHeight: '62vh' }}>
          {PIPELINE_STAGES.map(stage => {
            const stageItems = grouped[stage.key] || [];
            return (
              <div key={stage.key} className="min-w-[250px] max-w-[290px] flex-shrink-0">
                <div className="glass-card rounded-2xl h-full flex flex-col">
                  {/* Column Header */}
                  <div className={`p-3 rounded-t-2xl border-b-2 ${stage.border}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`size-2.5 rounded-full ${stage.dot} shadow-sm`} />
                        <span className={`text-xs font-bold ${stage.text}`}>{stage.label}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {stageItems.length}
                      </Badge>
                    </div>
                  </div>

                  {/* Cards */}
                  <Droppable droppableId={stage.key}>
                    {(provided) => (
                      <div
                        className="p-2 pt-1 flex-1 space-y-1.5 overflow-y-auto max-h-[calc(62vh-60px)] scrollbar-thin"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {stageItems.length === 0 && (
                          <div className="text-center py-8 px-2">
                            <p className="text-xs text-surface-300 font-medium italic">
                              {stage.key === 'MOU' ? 'No won deals' : stage.key === 'NOT_THIS_TIME' ? 'No lost schools' : 'Drop here'}
                            </p>
                          </div>
                        )}
                        {stageItems.map((item: any, idx: number) => (
                          <Draggable key={item.id} draggableId={item.id} index={idx}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-xl p-3 border border-surface-200 shadow-sm transition-all cursor-grab active:cursor-grabbing ${
                                  snapshot.isDragging ? 'shadow-lg scale-[1.02] rotate-[0.5deg]' : 'hover:shadow-card'
                                }`}
                              >
                                <div className="flex items-start gap-2.5">
                                  <div className={`w-1 h-full min-h-[28px] rounded-full ${stage.dot} flex-shrink-0 mt-1`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-surface-800 truncate leading-tight">
                                      {item.school?.name || 'Unknown School'}
                                    </p>
                                    <p className="text-[10px] text-surface-400 mt-0.5">
                                      {item.school?.city || '--'}
                                    </p>
                                    {item.value > 0 && (
                                      <p className="text-[11px] font-bold text-success-600 mt-1.5 flex items-center gap-1">
                                        <Hash size={10} />
                                        Rp {formatNumber(item.value)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Create Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add Opportunity</DialogTitle>
            <p className="text-xs text-surface-400 mt-1">Select a school to add to pipeline</p>
          </DialogHeader>
          <CreateForm
            schools={filteredSchools}
            search={search}
            onSearchChange={setSearch}
            onDone={() => { setShowModal(false); load(); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateForm({ schools, search, onSearchChange, onDone }: {
  schools: any[];
  search: string;
  onSearchChange: (v: string) => void;
  onDone: () => void;
}) {
  const [schoolId, setSchoolId] = useState('');
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;
    setSaving(true);
    try {
      await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId, value: parseInt(value || '0'), stage: 'PROSPECT' }),
      });
      onDone();
    } catch {} finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4 mt-2">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <Input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search schools..."
          className="pl-9 rounded-xl"
        />
      </div>
      <select
        value={schoolId}
        onChange={e => setSchoolId(e.target.value)}
        required
        className="w-full h-11 rounded-xl border border-surface-200 bg-white px-3 text-sm outline-none focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20"
      >
        <option value="">Select School</option>
        {schools.map(s => (
          <option key={s.id} value={s.id}>{s.name} {s.city ? `- ${s.city}` : ''}</option>
        ))}
      </select>
      <Input
        type="number"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Deal value Rp (optional)"
        className="rounded-xl"
      />
      <Button type="submit" className="w-full rounded-xl" disabled={saving}>
        {saving ? 'Saving...' : 'Add to Pipeline'}
      </Button>
    </form>
  );
}
