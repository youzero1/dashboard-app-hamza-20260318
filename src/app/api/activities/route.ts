import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Activity } from '@/lib/entities/Activity';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const ds = await getDataSource();
    const repo = ds.getRepository(Activity);

    const activities = await repo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return NextResponse.json({ activities });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
