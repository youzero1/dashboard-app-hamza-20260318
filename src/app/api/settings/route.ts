import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Setting } from '@/lib/entities/Setting';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Setting);
    const settings = await repo.find();
    return NextResponse.json({ settings });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { settings } = await request.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Setting);

    for (const s of settings) {
      const existing = await repo.findOne({ where: { key: s.key } });
      if (existing) {
        await repo.update({ key: s.key }, { value: s.value });
      } else {
        await repo.save(repo.create(s));
      }
    }

    const updated = await repo.find();
    return NextResponse.json({ settings: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
