import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/auth/prisma';
import { auth } from '@/lib/auth/auth';

const GEOFENCE_RADIUS = Number(process.env.GEOFENCING_RADIUS_METERS || 100);

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { latitude, longitude } = await req.json();
  if (!latitude || !longitude) return NextResponse.json({ error: 'Latitude and longitude required' }, { status: 400 });

  const visit = await prisma.visit.findUnique({ where: { id: params.id }, include: { school: true } });
  if (!visit) return NextResponse.json({ error: 'Visit not found' }, { status: 404 });

  // Geofencing check
  if (visit.school.latitude && visit.school.longitude) {
    const distance = haversineDistance(latitude, longitude, visit.school.latitude, visit.school.longitude);
    if (distance > GEOFENCE_RADIUS) {
      return NextResponse.json({
        error: `Terlalu jauh dari sekolah (${Math.round(distance)}m). Maks ${GEOFENCE_RADIUS}m.`,
        distance: Math.round(distance),
      }, { status: 403 });
    }
  }

  const updated = await prisma.visit.update({
    where: { id: params.id },
    data: { status: 'checked_in', checkInTime: new Date(), checkInLat: latitude, checkInLng: longitude },
  });

  return NextResponse.json({ ...updated, distance: visit.school.latitude ? haversineDistance(latitude, longitude, visit.school.latitude, visit.school.longitude) : null });
}
