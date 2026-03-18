import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { User } from '@/lib/entities/User';
import { Like } from 'typeorm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const ds = await getDataSource();
    const repo = ds.getRepository(User);

    const where = search
      ? [{ name: Like(`%${search}%`) }, { email: Like(`%${search}%`) }]
      : {};

    const [users, total] = await repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({ users, total });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(User);
    const user = repo.create(body);
    const saved = await repo.save(user);
    return NextResponse.json(saved, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
