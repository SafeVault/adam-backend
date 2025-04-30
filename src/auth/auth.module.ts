import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // Provides user-related services
    PassportModule, // Enables Passport.js for authentication
    JwtModule.register({
      secret: 'secret', // Replace with a secure secret in production
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],
  providers: [JwtStrategy],
  exports: [],
})
export class AuthModule {}