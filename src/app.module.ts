import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { PayrollsModule } from './payroll/payroll.module';
import { Payroll } from './payroll/payroll.entity';
import { PayrollEmployeeDetail } from './payroll/payroll-employee.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'sv-adam-db',
      entities: [User, Payroll, PayrollEmployeeDetail],
      synchronize: true, // set to false in production
    }),
    AuthModule,
    UsersModule,
    PayrollsModule
  ],
})
export class AppModule {}