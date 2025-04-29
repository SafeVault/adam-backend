import { IsArray, IsDate, IsNotEmpty, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EmployeePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  employee_id: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;
}

export class CreatePayrollDto {
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  paymentDate: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmployeePaymentDto)
  employees: EmployeePaymentDto[];
}