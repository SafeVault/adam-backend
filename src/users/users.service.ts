import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import bcrypt from 'bcrypt';
import { CreateEmployeeDto } from './users.dto';
import { isValidStarknetAddress } from '../validation/wallet-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    if (!email || !password) {
      return null;
    }

    if (email.length > 320) {
      return null;
    }

    const emailRegex =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const rExp: RegExp = new RegExp(emailRegex);

    if (!rExp.test(email)) {
      return null;
    }

    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    if (await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async createEmployee(dto: CreateEmployeeDto): Promise<User> {
    const employee = this.usersRepository.create({
      ...dto,
      password: await bcrypt.hash('adam', 10),
      role: UserRole.EMPLOYEE,
    });
    return this.usersRepository.save(employee);
  }

  async connectWallet(userId: string, walletAddress: string): Promise<User> {
    const normalizedAddress = walletAddress.startsWith('0x')
      ? walletAddress
      : `0x${walletAddress}`;

    if (!isValidStarknetAddress(normalizedAddress)) {
      throw new BadRequestException('Invalid Starknet wallet address');
    }

    const existingUser = await this.usersRepository.findOne({
      where: { walletAddress: normalizedAddress },
    });
    if (existingUser && existingUser.id !== Number(userId)) {
      throw new BadRequestException(
        'Wallet address is already connected to another account',
      );
    }

    const user = await this.usersRepository.findOne({
      where: { id: Number(userId) },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.walletAddress = normalizedAddress;
    return this.usersRepository.save(user);
  }
}
