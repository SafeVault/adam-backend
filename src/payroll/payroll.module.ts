import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { PayrollsController } from './payroll.controller';
import { PayrollsService } from './payroll.service';
import { PayrollProcessor } from './payroll.processor';
import { Payroll } from './payroll.entity';
import { PayrollEmployeeDetail } from './payroll-employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payroll, PayrollEmployeeDetail]),
    ScheduleModule.forRoot(),
  ],
  controllers: [PayrollsController],
  providers: [PayrollsService, PayrollProcessor],
  exports: [PayrollsService],
})
export class PayrollsModule {}