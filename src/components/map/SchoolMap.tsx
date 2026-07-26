'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const STATUS_COLORS: Record<string, string> = {
  POTENTIAL: '#94A3B8',
  CONTACTED: '#3B82F6',
  VISITED: '#F89029',
  PROPOSAL_SENT: '#8B5CF6',
  NEGOTIATION: '#F59E0B',
  WON: '#10B981',
  LOST: '#EF4444',
};

function createSchoolIcon(status: string) {
  const color = STATUS_COLORS[status] || '#94A3B8';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <path d="M14 0C6.268 0 0 5.373 0 12c0 9 14 24 14 24s14-15 14-24C28 5.373 21.732 0 14 0z" fill="url(#grad)" filter="url(#shadow)"/>
      <circle cx="14" cy="11" r="5" fill="white" opacity="0.95"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-marker',
    html: svg,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });
}

interface SchoolMapProps {
  schools: Array<{
    id: string;
    name: string;
    city?: string | null;
    status: string;
    latitude?: number | null;
    longitude?: number | null;
  }>;
}

export default function SchoolMap({ schools }: SchoolMapProps) {
  const withCoords = schools.filter(s => s.latitude && s.longitude);
  const center: [number, number] = [-2.5, 118];

  return (
    <MapContainer
      center={center}
      zoom={5}
      className="h-[450px] w-full z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {withCoords.map(s => (
        <Marker
          key={s.id}
          position={[s.latitude!, s.longitude!]}
          icon={createSchoolIcon(s.status)}
        >
          <Popup>
            <div className="space-y-1">
              <p className="text-sm font-bold text-surface-800">{s.name}</p>
              <p className="text-xs text-surface-400">
                {s.city ? `${s.city} • ` : ''}{s.status}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
