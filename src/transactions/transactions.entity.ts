import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAW = 'Withdraw',
}

export enum TransactionStatus {
  SUCCESSFUL = 'Successful',
  FAILED = 'Failed',
  PENDING = 'Pending',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  type: TransactionType;

  @CreateDateColumn()
  createdAt: Date;

  @Column('float')
  amount: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  department: string;

  @Column({
    type: 'varchar',
  })
  status: TransactionStatus;

  @Column()
  network: string;

  @Column()
  currency: string;

  @Column()
  userId: string;
} 