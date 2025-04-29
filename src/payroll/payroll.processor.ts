import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Payroll, PayrollStatus } from './payroll.entity';
import { PayrollEmployeeDetail } from './payroll-employee.entity';

@Injectable()
export class PayrollProcessor {
  private readonly logger = new Logger(PayrollProcessor.name);

  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectRepository(PayrollEmployeeDetail)
    private payrollEmployeeDetailRepository: Repository<PayrollEmployeeDetail>,
  ) {}

  @Cron('0 0 * * *') // Run at midnight every day
  async processScheduledPayrolls() {
    this.logger.log('Processing scheduled payrolls...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const payrollsToProcess = await this.payrollRepository.find({
      where: {
        paymentDate: today,
        status: PayrollStatus.PENDING,
      },
    });
    
    this.logger.log(`Found ${payrollsToProcess.length} payrolls to process`);
    
    for (const payroll of payrollsToProcess) {
      try {
        // Update status to processing
        payroll.status = PayrollStatus.PROCESSING;
        await this.payrollRepository.save(payroll);
        
        // Get payroll details with amounts
        const details = await this.payrollEmployeeDetailRepository.find({
          where: { payroll_id: payroll.id },
        });
        
        this.logger.log(`Processing payroll ${payroll.id} with ${details.length} employees`);
        
        // Process payments for each employee
        for (const detail of details) {
          try {
            this.logger.log(`Processing payment of ${detail.amount} for employee ${detail.employee_id}`);
            
            // Simulate payment processing
            // In a real implementation, you would call your payment provider
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            this.logger.error(`Failed to process payment for employee ${detail.employee_id}:`, error);
            // Continue processing other employees even if one fails
          }
        }
        
        // Update status to paid
        payroll.status = PayrollStatus.PAID;
        await this.payrollRepository.save(payroll);
        this.logger.log(`Successfully processed payroll ${payroll.id}`);
      } catch (error) {
        this.logger.error(`Failed to process payroll ${payroll.id}:`, error);
        
        // Update status to failed
        payroll.status = PayrollStatus.FAILED;
        await this.payrollRepository.save(payroll);
      }
    }
  }
}