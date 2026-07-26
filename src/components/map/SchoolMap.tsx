'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background:#F89029;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;font-size:12px;box-shadow:0 2px 4px rgba(0,0,0,0.3);">📍</div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const STATUS_COLORS: Record<string, string> = {
  POTENTIAL: '#94A3B8', CONTACTED: '#3B82F6', VISITED: '#F89029',
  PROPOSAL_SENT: '#8B5CF6', NEGOTIATION: '#F59E0B', WON: '#10B981', LOST: '#EF4444',
};

function createSchoolIcon(status: string) {
  const color = STATUS_COLORS[status] || '#94A3B8';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};color:white;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;font-size:10px;box-shadow:0 2px 4px rgba(0,0,0,0.3);">📌</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

interface SchoolMapProps {
  schools: Array<{ id: string; name: string; city?: string | null; status: string; latitude?: number | null; longitude?: number | null }>;
}

export default function SchoolMap({ schools }: SchoolMapProps) {
  const withCoords = schools.filter(s => s.latitude && s.longitude);
  const center: [number, number] = [-2.5, 118];

  return (
    <MapContainer center={center} zoom={5} className="h-[400px] w-full z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {withCoords.map(s => (
        <Marker key={s.id} position={[s.latitude!, s.longitude!]} icon={createSchoolIcon(s.status)}>
          <Popup>
            <p className="text-sm font-semibold">{s.name}</p>
            <p className="text-xs text-slate-500">{s.city || ''} · {s.status}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
