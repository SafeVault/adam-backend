import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateEmployeeDto, ConnectWalletDto } from './users.dto';
import { User, UserRole } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('connect-wallet')
  async connectWallet(
    @Request() req: { user: { id: string } },
    @Body() connectWalletDto: ConnectWalletDto,
  ) {
    return this.usersService.connectWallet(
      req.user.id,
      connectWalletDto.walletAddress,
    );
  }
}

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async createEmployee(@Body() dto: CreateEmployeeDto): Promise<User> {
    return this.usersService.createEmployee(dto);
  }
}
