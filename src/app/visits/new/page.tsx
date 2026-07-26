'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Navigation, Check, ArrowRight, School, ClipboardList, Crosshair, ChevronLeft } from 'lucide-react';

const VISIT_TYPES = [
  { value: 'cold_call', label: 'Cold Call', desc: 'First contact with school' },
  { value: 'survey', label: 'Survey', desc: 'School data collection' },
  { value: 'presentation', label: 'Presentasi', desc: 'Program presentation' },
  { value: 'follow_up', label: 'Follow-up', desc: 'Follow up previous visit' },
  { value: 'closing', label: 'Closing', desc: 'Final deal closing' },
];

const STEPS = [
  { id: 'school', label: 'School', icon: School },
  { id: 'location', label: 'GPS', icon: Crosshair },
  { id: 'survey', label: 'Survey', icon: ClipboardList },
];

export default function NewVisitPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<any[]>([]);
  const [step, setStep] = useState<'school' | 'location' | 'survey'>('school');
  const [form, setForm] = useState({
    schoolId: '', visitType: 'cold_call', notes: '',
    studentCount: '', teacherCount: '', hasEnglishProgram: 'false',
    existingProgramName: '', picName: '', picPosition: '', picPhone: '',
  });
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [error, setError] = useState('');

  const currentStepIdx = STEPS.findIndex(s => s.id === step);

  useEffect(() => {
    fetch('/api/schools?per_page=200').then(r => r.json()).then(d => setSchools(d.data || [])).catch(() => {});
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) { alert('GPS tidak tersedia'); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGpsLoading(false); setStep('survey'); },
      () => { alert('Gagal dapat lokasi. Aktifkan GPS.'); setGpsLoading(false); },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.schoolId || !gps) return;
    setSaving(true);
    setError('');
    try {
      const visitRes = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId: form.schoolId, status: 'checked_in' }),
      });
      if (!visitRes.ok) throw new Error('Gagal buat kunjungan');
      const visit = await visitRes.json();
      await fetch(`/api/visits/${visit.id}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gps),
      });
      router.push('/visits');
    } catch (err: any) {
      setError(err.message || 'Gagal');
    } finally { setSaving(false); }
  };

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-surface-100 transition-all">
          <ChevronLeft size={20} className="text-surface-500" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-surface-900 tracking-tight">New Visit</h1>
          <p className="text-xs text-surface-400 mt-0.5">Create a new field visit</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = i === currentStepIdx;
          const done = i < currentStepIdx;
          return (
            <div key={s.id} className="flex items-center gap-1 flex-1">
              <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-xl transition-all text-xs font-semibold ${
                active ? 'bg-brand-50 text-brand-600 border border-brand-200' :
                done ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                'bg-surface-50 text-surface-400 border border-surface-200'
              }`}>
                <div className={`size-6 rounded-lg flex items-center justify-center ${
                  active ? 'bg-brand-500 text-white' :
                  done ? 'bg-emerald-500 text-white' :
                  'bg-surface-200 text-surface-400'
                }`}>
                  {done ? <Check size={12} strokeWidth={3} /> : <Icon size={12} />}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 rounded-full ${i < currentStepIdx ? 'bg-emerald-300' : 'bg-surface-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-600 font-medium">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="glass-card rounded-2xl p-5">
        {step === 'school' && (
          <div className="space-y-4 animate-slide-right">
            <div>
              <label className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2 block">School</label>
              <select
                value={form.schoolId}
                onChange={e => update('schoolId', e.target.value)}
                required
                className="w-full h-11 rounded-xl border border-surface-200 bg-white px-3 text-sm outline-none focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20"
              >
                <option value="" disabled>Select school</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name} - {s.city || ''}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2 block">Visit Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {VISIT_TYPES.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => update('visitType', t.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      form.visitType === t.value
                        ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/20'
                        : 'border-surface-200 bg-white hover:border-surface-300'
                    }`}
                  >
                    <p className="text-xs font-bold text-surface-700">{t.label}</p>
                    <p className="text-[10px] text-surface-400 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep('location')}
              disabled={!form.schoolId}
              className="w-full rounded-xl shadow-lg shadow-brand-500/20"
            >
              Continue to GPS <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        )}

        {step === 'location' && (
          <div className="text-center py-6 animate-slide-left">
            <div className={`size-20 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all ${
              gps ? 'bg-emerald-50' : 'bg-brand-50'
            }`}>
              {gps ? (
                <Check size={36} className="text-emerald-500" strokeWidth={2.5} />
              ) : (
                <Navigation size={36} className="text-brand-500" />
              )}
            </div>
            <p className="text-base font-bold text-surface-800 mb-1">
              {gps ? 'Location Captured' : 'Capture GPS Location'}
            </p>
            <p className="text-xs text-surface-400 mb-5 max-w-xs mx-auto">
              {gps ? 'Your location has been recorded for this visit.' : 'Make sure GPS is active and you are at the school location.'}
            </p>

            {gps ? (
              <div className="flex items-center justify-center gap-2 mb-5">
                <div className="px-3 py-2 rounded-xl bg-emerald-50 text-xs font-mono text-emerald-700 font-semibold">
                  {gps.lat.toFixed(4)}, {gps.lng.toFixed(4)}
                </div>
              </div>
            ) : (
              <Button
                onClick={getLocation}
                disabled={gpsLoading}
                className="rounded-xl shadow-lg"
              >
                {gpsLoading ? (
                  <><Loader2 size={16} className="animate-spin mr-2" /> Fetching...</>
                ) : (
                  <><Crosshair size={16} className="mr-2" /> Get Location</>
                )}
              </Button>
            )}

            <div className="flex gap-2 mt-5 justify-center">
              <Button variant="outline" onClick={() => setStep('school')} className="rounded-xl" size="sm">
                Back
              </Button>
              {gps && (
                <Button onClick={() => setStep('survey')} className="rounded-xl" size="sm">
                  Continue <ArrowRight size={14} className="ml-1" />
                </Button>
              )}
            </div>
          </div>
        )}

        {step === 'survey' && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-slide-left">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1.5 block">Students</label>
                <Input type="number" value={form.studentCount} onChange={e => update('studentCount', e.target.value)} placeholder="0" className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1.5 block">Teachers</label>
                <Input type="number" value={form.teacherCount} onChange={e => update('teacherCount', e.target.value)} placeholder="0" className="rounded-xl" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1.5 block">English Program</label>
              <select
                value={form.hasEnglishProgram}
                onChange={e => update('hasEnglishProgram', e.target.value)}
                className="w-full h-11 rounded-xl border border-surface-200 bg-white px-3 text-sm outline-none focus-visible:border-brand-500"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            {form.hasEnglishProgram === 'true' && (
              <div>
                <label className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1.5 block">Program Name</label>
                <Input value={form.existingProgramName} onChange={e => update('existingProgramName', e.target.value)} placeholder="e.g. Cambridge English" className="rounded-xl" />
              </div>
            )}

            <div className="border-t border-surface-200 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="size-6 rounded-lg bg-brand-50 flex items-center justify-center">
                  <ClipboardList size={12} className="text-brand-500" />
                </div>
                <p className="text-xs font-bold text-surface-500 uppercase tracking-wider">PIC Data</p>
              </div>
              <div className="space-y-2.5">
                <Input placeholder="PIC Name" value={form.picName} onChange={e => update('picName', e.target.value)} className="rounded-xl" />
                <Input placeholder="Position" value={form.picPosition} onChange={e => update('picPosition', e.target.value)} className="rounded-xl" />
                <Input placeholder="Phone Number" value={form.picPhone} onChange={e => update('picPhone', e.target.value)} className="rounded-xl" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1.5 block">Notes</label>
              <Textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Visit notes..." className="rounded-xl h-24 resize-none" />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => setStep('location')} className="rounded-xl" size="sm">
                Back
              </Button>
              <Button type="submit" disabled={saving} className="flex-1 rounded-xl shadow-lg shadow-brand-500/20">
                {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Check size={16} className="mr-1.5" />}
                {saving ? 'Saving...' : 'Save Visit'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
