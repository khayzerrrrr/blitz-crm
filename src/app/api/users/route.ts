import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/auth/prisma';
import { auth } from '@/lib/auth/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: { select: { name: true } },
        island: { select: { name: true } },
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ data: users });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.name || !body.email || !body.password || !body.roleId) {
      return NextResponse.json({ error: 'name, email, password, and roleId are required' }, { status: 400 });
    }

    const { hash } = await import('bcryptjs');
    const passwordHash = await hash(body.password, 12);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        roleId: body.roleId,
        islandId: body.islandId || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: { select: { name: true } },
        island: { select: { name: true } },
        createdAt: true,
      },
    });

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
