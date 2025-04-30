import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Payroll } from './payroll.entity';
import { User } from '../users/user.entity';

@Entity('payroll_employee_details')
export class PayrollEmployeeDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Payroll, (payroll) => payroll.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payroll_id' })
  payroll: Payroll;

  @ManyToOne(() => User, (user) => user.payrollDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  payroll_id: number;

  @Column()
  employee_id: number;
}