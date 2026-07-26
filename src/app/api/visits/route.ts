import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/auth/prisma';
import { auth } from '@/lib/auth/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = session.user;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');

    const where: any = {};
    if (user.role === 'SALES') where.userId = user.id;
    else if (user.role === 'REGIONAL' && user.islandId) {
      const schools = await prisma.school.findMany({ where: { islandId: user.islandId }, select: { id: true } });
      where.schoolId = { in: schools.map(s => s.id) };
    }
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.visit.findMany({
        where,
        include: {
          school: { select: { id: true, name: true, city: true, latitude: true, longitude: true } },
          user: { select: { id: true, name: true } },
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.visit.count({ where }),
    ]);

    return NextResponse.json({ data, pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) } });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    if (!body.schoolId) return NextResponse.json({ error: 'schoolId is required' }, { status: 400 });

    const visit = await prisma.visit.create({
      data: {
        schoolId: body.schoolId,
        userId: session.user.id,
        status: body.status || 'planned',
      },
      include: {
        school: { select: { id: true, name: true, city: true, latitude: true, longitude: true } },
      },
    });
    return NextResponse.json({ data: visit }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
