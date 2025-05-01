import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { EmployeesService } from './employees.service';

@Controller('employees')
@UseGuards(AuthGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @Roles('admin')
  async getEmployees(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    return this.employeesService.getPaginatedEmployees(pageNum, pageSize);
  }
}
