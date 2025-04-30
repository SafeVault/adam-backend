import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    return this.usersService.validateUser(email, pass);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const { email, password } = createUserDto;

    // Check if the user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const validRoles: Array<'admin' | 'employee'> = ['admin', 'employee'];
    const role = validRoles.includes(createUserDto.role as 'admin' | 'employee')
      ? (createUserDto.role as 'admin' | 'employee')
      : undefined;

    return this.usersService.create({
      ...createUserDto,
      role,
      password: hashedPassword,
    });
  }
}