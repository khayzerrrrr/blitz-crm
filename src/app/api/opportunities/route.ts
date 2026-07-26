import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/auth/prisma';
import { auth } from '@/lib/auth/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const stage = searchParams.get('stage');
    const search = searchParams.get('search');

    const where: any = {};
    if (session.user.role === 'SALES') where.userId = session.user.id;
    else if (session.user.role === 'REGIONAL' && session.user.islandId) {
      const schools = await prisma.school.findMany({ where: { islandId: session.user.islandId }, select: { id: true } });
      where.schoolId = { in: schools.map(s => s.id) };
    }
    if (stage) where.stage = stage;
    if (search) {
      where.school = { name: { contains: search, mode: 'insensitive' } };
    }

    const data = await prisma.opportunity.findMany({
      where,
      include: {
        school: { select: { id: true, name: true, city: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    if (!body.schoolId) return NextResponse.json({ error: 'schoolId is required' }, { status: 400 });

    const opp = await prisma.opportunity.create({
      data: {
        schoolId: body.schoolId,
        userId: session.user.id,
        stage: body.stage || 'PROSPECT',
        value: body.value || 0,
      },
      include: {
        school: { select: { id: true, name: true, city: true } },
        user: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json({ data: opp }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
