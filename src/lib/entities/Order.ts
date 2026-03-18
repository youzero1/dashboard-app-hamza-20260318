import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  customerName!: string;

  @Column({ type: 'real' })
  amount!: number;

  @Column({ default: 'pending' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
