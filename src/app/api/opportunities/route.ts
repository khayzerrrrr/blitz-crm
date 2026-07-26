import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/auth/prisma';
import { auth } from '@/lib/auth/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const where: any = {};
  if (session.user.role === 'SALES') where.userId = session.user.id;
  else if (session.user.role === 'REGIONAL' && session.user.islandId) {
    const schools = await prisma.school.findMany({ where: { islandId: session.user.islandId }, select: { id: true } });
    where.schoolId = { in: schools.map(s => s.id) };
  }

  const data = await prisma.opportunity.findMany({
    where, include: { school: { select: { id: true, name: true, city: true } }, user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const opp = await prisma.opportunity.create({
    data: { schoolId: body.schoolId, userId: session.user.id, stage: body.stage || 'NEW_PROSPECT', value: body.value || 0 },
  });
  return NextResponse.json(opp, { status: 201 });
}
