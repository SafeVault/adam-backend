import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PayrollsService } from './payroll.service';
import { CreatePayrollDto } from './payroll.dto';
import { Payroll } from './payroll.entity';
import { PayrollEmployeeDetail } from './payroll-employee.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('payrolls')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PayrollsController {
  constructor(private readonly payrollsService: PayrollsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async createPayroll(@Body() dto: CreatePayrollDto): Promise<Payroll> {
    return this.payrollsService.createPayroll(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async fetchUpcomingPayrolls() {
    return await this.payrollsService.fetchUpcomingPayrolls();
  }
}
