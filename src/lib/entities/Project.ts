import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ default: 'active' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
