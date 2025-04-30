import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Payroll } from './payroll.entity';
import { User } from '../users/user.entity';

@Entity('payroll_employee_details')
export class PayrollEmployeeDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Payroll, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payroll_id' })
  payroll: Payroll;

  @Column()
  payroll_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  @Column()
  employee_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;
}