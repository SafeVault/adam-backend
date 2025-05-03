import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Token missing');

    try {
      const user = await this.jwtService.verifyAsync(token);
      req.user = user;

      if (requiredRoles && !requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Access denied');
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
