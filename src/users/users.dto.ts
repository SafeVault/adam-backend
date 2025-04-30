import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  walletAddress?: string;
}

export class ConnectWalletDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(0x)?[a-fA-F0-9]{64}$/, {
    message: 'Invalid Starknet wallet address format',
  })
  walletAddress!: string;
}
