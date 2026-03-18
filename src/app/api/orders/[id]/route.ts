import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Order } from '@/lib/entities/Order';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Order);
    await repo.update(parseInt(params.id), body);
    const updated = await repo.findOne({ where: { id: parseInt(params.id) } });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Order);
    await repo.delete(parseInt(params.id));
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
