import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Project } from '@/lib/entities/Project';
import { Like } from 'typeorm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const ds = await getDataSource();
    const repo = ds.getRepository(Project);

    const qb = repo.createQueryBuilder('project');

    if (search) {
      qb.where('project.title LIKE :search OR project.description LIKE :search', { search: `%${search}%` });
    }

    if (status) {
      if (search) {
        qb.andWhere('project.status = :status', { status });
      } else {
        qb.where('project.status = :status', { status });
      }
    }

    qb.orderBy('project.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [projects, total] = await qb.getManyAndCount();

    return NextResponse.json({ projects, total });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Project);
    const project = repo.create(body);
    const saved = await repo.save(project);
    return NextResponse.json(saved, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
