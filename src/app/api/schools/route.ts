import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/auth/prisma';
import { auth } from '@/lib/auth/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');
    const user = session.user;

    const where: any = {};
    if (user.role === 'SALES') where.assignedToUserId = user.id;
    else if (user.role === 'REGIONAL' && user.islandId) where.islandId = user.islandId;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.school.findMany({
        where,
        include: { island: true, assignedTo: { select: { id: true, name: true } } },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { name: 'asc' },
      }),
      prisma.school.count({ where }),
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
    if (!body.name) return NextResponse.json({ error: 'name is required' }, { status: 400 });

    const school = await prisma.school.create({
      data: {
        name: body.name,
        city: body.city || null,
        province: body.province || null,
        address: body.address || null,
        latitude: body.latitude ?? null,
        longitude: body.longitude ?? null,
        islandId: body.islandId || null,
        assignedToUserId: session.user.id,
      },
      include: { island: true, assignedTo: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ data: school }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
