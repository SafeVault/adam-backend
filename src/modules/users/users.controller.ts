import { Controller, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ConnectWalletDto } from './dto/connect-wallet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';

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
