import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Project } from './entities/Project';
import { Order } from './entities/Order';
import { Activity } from './entities/Activity';
import { Setting } from './entities/Setting';
import path from 'path';

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : path.resolve(process.cwd(), './data/dashboard.db');

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    synchronize: true,
    logging: false,
    entities: [User, Project, Order, Activity, Setting],
  });

  await dataSource.initialize();
  return dataSource;
}
