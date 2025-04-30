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
  ) { }

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


  async sendResetToken(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate a reset token
    const token = this.jwtService.sign(
      { email: user.email },
      { expiresIn: '15m' }, // Token expires in 15 minutes
    );

    // Simulate sending email (replace with actual email service)
    console.log(`Reset token for ${email}: ${token}`);

    return { message: 'Reset token sent to your email' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      // Verify the token
      const payload = this.jwtService.verify(token);

      // Find the user by email
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new BadRequestException('Invalid token');
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      await this.usersService.updatePassword(user.id, hashedPassword);

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}