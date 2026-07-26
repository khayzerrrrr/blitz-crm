'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Camera, Loader2 } from 'lucide-react';

const VISIT_TYPES = [
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'survey', label: 'Survey' },
  { value: 'presentation', label: 'Presentasi' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'closing', label: 'Closing' },
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
      // Create visit
      const visitRes = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId: form.schoolId, status: 'checked_in' }),
      });
      if (!visitRes.ok) throw new Error('Gagal buat kunjungan');
      const visit = await visitRes.json();

      // Check-in
      const checkinRes = await fetch(`/api/visits/${visit.id}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gps),
      });

      // TODO: Save survey data via API (VisitSurvey model exists in schema)

      router.push('/visits');
    } catch (err: any) {
      setError(err.message || 'Gagal');
    } finally { setSaving(false); }
  };

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Kunjungan Baru</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs">
        <StepDot active={step === 'school'} done={step !== 'school'} label="Pilih Sekolah" />
        <StepDot active={step === 'location'} done={step === 'survey'} label="Check-in GPS" />
        <StepDot active={step === 'survey'} done={false} label="Survey" />
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

      <Card>
        <CardContent className="p-4 space-y-4">
          {step === 'school' && (
            <>
              <div>
                <label className="text-sm font-medium mb-1 block">Sekolah *</label>
                <select value={form.schoolId} onChange={e => update('schoolId', e.target.value)} required className="w-full p-2 border rounded-lg text-sm" defaultValue="">
                  <option value="" disabled>Pilih sekolah</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name} - {s.city || ''}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tipe Kunjungan</label>
                <select value={form.visitType} onChange={e => update('visitType', e.target.value)} className="w-full p-2 border rounded-lg text-sm">
                  {VISIT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <Button onClick={() => setStep('location')} disabled={!form.schoolId} className="w-full bg-orange-500 hover:bg-orange-600">
                Lanjut ke Check-in
              </Button>
            </>
          )}

          {step === 'location' && (
            <div className="text-center py-6">
              <MapPin size={48} className="mx-auto mb-3 text-orange-500" />
              <p className="font-medium mb-1">Ambil Lokasi GPS</p>
              <p className="text-xs text-slate-400 mb-4">Pastikan GPS aktif untuk check-in</p>
              {gps ? (
                <div className="text-sm text-emerald-600 mb-3">
                  ✅ Lokasi: {gps.lat.toFixed(4)}, {gps.lng.toFixed(4)}
                </div>
              ) : (
                <Button onClick={getLocation} disabled={gpsLoading} className="bg-orange-500 hover:bg-orange-600">
                  {gpsLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
                  Ambil Lokasi
                </Button>
              )}
              {gps && <Button onClick={() => setStep('survey')} className="ml-2">Lanjut</Button>}
            </div>
          )}

          {step === 'survey' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium">Jumlah Siswa</label><Input type="number" value={form.studentCount} onChange={e => update('studentCount', e.target.value)} /></div>
                <div><label className="text-xs font-medium">Jumlah Guru</label><Input type="number" value={form.teacherCount} onChange={e => update('teacherCount', e.target.value)} /></div>
              </div>
              <div>
                <label className="text-xs font-medium">Program Inggris?</label>
                <select value={form.hasEnglishProgram} onChange={e => update('hasEnglishProgram', e.target.value)} className="w-full p-2 border rounded-lg text-sm mt-1">
                  <option value="false">Tidak</option>
                  <option value="true">Ya</option>
                </select>
              </div>
              {form.hasEnglishProgram === 'true' && (
                <div><label className="text-xs font-medium">Nama Program</label><Input value={form.existingProgramName} onChange={e => update('existingProgramName', e.target.value)} /></div>
              )}

              <div className="border-t pt-3">
                <p className="text-xs font-semibold text-slate-600 mb-2">📋 Data PIC</p>
                <div className="space-y-2">
                  <Input placeholder="Nama PIC" value={form.picName} onChange={e => update('picName', e.target.value)} />
                  <Input placeholder="Jabatan" value={form.picPosition} onChange={e => update('picPosition', e.target.value)} />
                  <Input placeholder="No. Telepon" value={form.picPhone} onChange={e => update('picPhone', e.target.value)} />
                </div>
              </div>

              <div><label className="text-xs font-medium">Catatan</label><textarea value={form.notes} onChange={e => update('notes', e.target.value)} className="w-full p-2 border rounded-lg text-sm mt-1 h-20" /></div>

              <Button type="submit" disabled={saving} className="w-full bg-orange-500 hover:bg-orange-600">
                {saving ? 'Menyimpan...' : 'Simpan Kunjungan'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  const bg = active ? 'bg-orange-500' : done ? 'bg-emerald-500' : 'bg-slate-200';
  return <div className="flex items-center gap-1"><div className={`w-5 h-5 rounded-full ${bg} flex items-center justify-center text-white text-[10px]`}>{done ? '✓' : active ? '○' : '○'}</div><span className={active ? 'font-medium' : 'text-slate-400'}>{label}</span></div>;
}
