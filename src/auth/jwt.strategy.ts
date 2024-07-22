import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from './user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.schema';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  private static extractJwt(req: Request): string | null {
    if (
      req.cookies &&
      'user_token' in req.cookies &&
      req.cookies.user_token > 0
    ) {
      return req.cookies.user_token;
    }

    return null;
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { userId, username } = payload;
    const user: User = await this.usersRepository.findOne({
      where: { userId, username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
