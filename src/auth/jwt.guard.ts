import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtStrategy: JwtStrategy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['access_token'];

    if (!token) {
      return false;
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = jwt.verify(token, secret) as JwtPayload;
      request.user = await this.jwtStrategy.validate(decoded);
      return true;
    } catch (error) {
      return false;
    }
  }
}
