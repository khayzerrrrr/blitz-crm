'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Loader2 } from 'lucide-react';

const STAGES = [
  { key: 'NEW_PROSPECT', label: 'New Prospect', color: 'bg-slate-400' },
  { key: 'INITIAL_CONTACT', label: 'Initial Contact', color: 'bg-blue-400' },
  { key: 'SCHOOL_VISIT_DONE', label: 'Visit Done', color: 'bg-orange-400' },
  { key: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'bg-violet-400' },
  { key: 'NEGOTIATION', label: 'Negotiation', color: 'bg-amber-400' },
  { key: 'CLOSED_WON', label: 'Won 🏆', color: 'bg-emerald-400' },
  { key: 'CLOSED_LOST', label: 'Lost ❌', color: 'bg-red-400' },
];

const STAGE_KEYS = ['NEW_PROSPECT', 'INITIAL_CONTACT', 'SCHOOL_VISIT_DONE', 'PROPOSAL_SENT', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];

export default function PipelinePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await fetch('/api/opportunities');
      const json = await res.json();
      setItems(json.data || []);
    } catch {} finally { setLoading(false) }
  };

  const grouped = STAGE_KEYS.reduce((acc: any, key) => {
    acc[key] = items.filter(i => i.stage === key);
    return acc;
  }, {});

  const handleDragEnd = useCallback(async (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStage = destination.droppableId;

    // Optimistic update
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
      setSchools(json.data || []);
    } catch {}
    setShowModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pipeline</h1>
          <p className="text-sm text-slate-500">{items.length} opportunities</p>
        </div>
        <Button onClick={openCreate} className="bg-orange-500 hover:bg-orange-600"><Plus size={16} /> Tambah</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" /></div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: '60vh' }}>
            {STAGES.map(stage => (
              <div key={stage.key} className="min-w-[220px] flex-shrink-0">
                <Card>
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                        <CardTitle className="text-xs font-semibold">{stage.label}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{(grouped[stage.key] || []).length}</Badge>
                    </div>
                  </CardHeader>
                  <Droppable droppableId={stage.key}>
                    {(provided) => (
                      <CardContent className="p-2 pt-0 space-y-1.5 min-h-[120px]" ref={provided.innerRef} {...provided.droppableProps}>
                        {(grouped[stage.key] || []).length === 0 && (
                          <p className="text-xs text-slate-300 text-center py-4">—</p>
                        )}
                        {(grouped[stage.key] || []).map((item: any, idx: number) => (
                          <Draggable key={item.id} draggableId={item.id} index={idx}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs shadow-sm hover:shadow cursor-grab active:cursor-grabbing">
                                <p className="font-semibold truncate">{item.school?.name || item.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{item.school?.city || ''}</p>
                                {item.value > 0 && <p className="text-[10px] font-medium text-emerald-600 mt-1">Rp {new Intl.NumberFormat('id-ID').format(item.value)}</p>}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </CardContent>
                    )}
                  </Droppable>
                </Card>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold mb-4">Tambah Opportunity</h2>
            <CreateForm schools={schools} onDone={() => { setShowModal(false); load(); }} />
          </div>
        </div>
      )}
    </div>
  );
}

function CreateForm({ schools, onDone }: { schools: any[]; onDone: () => void }) {
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
        body: JSON.stringify({ schoolId, value: parseInt(value || '0'), stage: 'NEW_PROSPECT' }),
      });
      onDone();
    } catch {} finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <select value={schoolId} onChange={e => setSchoolId(e.target.value)} required className="w-full p-2 border rounded-lg text-sm">
        <option value="">Pilih Sekolah</option>
        {schools.map(s => <option key={s.id} value={s.id}>{s.name} - {s.city || ''}</option>)}
      </select>
      <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Nilai deal (opsional)" className="w-full p-2 border rounded-lg text-sm" />
      <Button type="submit" disabled={saving} className="w-full bg-orange-500 hover:bg-orange-600">
        {saving ? 'Menyimpan...' : 'Tambah'}
      </Button>
    </form>
  );
}
