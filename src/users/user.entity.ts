import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { PayrollEmployeeDetail } from '../payroll/payroll-employee.entity';

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  walletAddress?: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role: 'admin' | 'employee';

  @OneToMany(() => PayrollEmployeeDetail, (detail) => detail.employee)
  payrollDetails: PayrollEmployeeDetail[];

  @CreateDateColumn()
  createdAt: Date;
}