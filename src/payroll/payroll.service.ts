import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Payroll, PayrollStatus } from './payroll.entity';
import { PayrollEmployeeDetail } from './payroll-employee.entity';
import { CreatePayrollDto } from './payroll.dto';

@Injectable()
export class PayrollsService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectRepository(PayrollEmployeeDetail)
    private payrollEmployeeDetailRepository: Repository<PayrollEmployeeDetail>,
  ) {}

  async createPayroll(dto: CreatePayrollDto): Promise<Payroll> {
    const payroll = this.payrollRepository.create({
      paymentDate: dto.paymentDate,
      status: PayrollStatus.PENDING,
    });
    
    const savedPayroll = await this.payrollRepository.save(payroll);
    
    // Create employee payment details
    const payrollEmployeeDetails = dto.employees.map(empDto => 
      this.payrollEmployeeDetailRepository.create({
        payroll_id: savedPayroll.id,
        employee_id: empDto.employee_id,
        amount: empDto.amount,
      })
    );
    
    // Save all employee payment details
    await this.payrollEmployeeDetailRepository.save(payrollEmployeeDetails);
    
    // Return the created payroll
    return this.findOne(savedPayroll.id);
  }

  async findAll(): Promise<Payroll[]> {
    return this.payrollRepository.find();
  }

  async findOne(id: number): Promise<Payroll> {
    const payroll = await this.payrollRepository.findOne({
      where: { id },
    });
    
    if (!payroll) {
      throw new NotFoundException(`Payroll with ID ${id} not found`);
    }
    
    return payroll;
  }

  async getPayrollDetails(payrollId: number): Promise<PayrollEmployeeDetail[]> {
    const details = await this.payrollEmployeeDetailRepository.find({
      where: { payroll_id: payrollId },
    });
    
    if (!details.length) {
      throw new NotFoundException(`No details found for payroll ID ${payrollId}`);
    }
    
    return details;
  }

  async fetchUpcomingPayrolls(): Promise<Payroll[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    return await this.payrollRepository.find({
      where: { createdAt: MoreThan(today) },
      relations: ['details', 'details.employee'], // Include both details and employee info
      order: {
        createdAt: 'ASC', // Optional: order by soonest first
      },
    });
  }
}