import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ConnectWalletDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(0x)?[a-fA-F0-9]{64}$/, {
    message: 'Invalid Starknet wallet address format',
  })
  walletAddress!: string;
}
