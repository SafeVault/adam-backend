import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Replace if using TypeORM or Mongoose

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPaginatedEmployees(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [employees, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'employee' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          role: true,
        },
      }),
      this.prisma.user.count({ where: { role: 'employee' } }),
    ]);

    return {
      page,
      limit,
      totalCount,
      employees,
    };
  }
}
