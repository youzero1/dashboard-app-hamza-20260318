import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Order } from '@/lib/entities/Order';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const ds = await getDataSource();
    const repo = ds.getRepository(Order);

    const qb = repo.createQueryBuilder('order');

    if (search) {
      qb.where('order.customerName LIKE :search', { search: `%${search}%` });
    }

    if (status) {
      if (search) {
        qb.andWhere('order.status = :status', { status });
      } else {
        qb.where('order.status = :status', { status });
      }
    }

    qb.orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [orders, total] = await qb.getManyAndCount();

    return NextResponse.json({ orders, total });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Order);
    const order = repo.create(body);
    const saved = await repo.save(order);
    return NextResponse.json(saved, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
