import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { isValidStarknetAddress } from '../../validation/wallet-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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
