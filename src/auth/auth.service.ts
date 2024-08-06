import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import {
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dtos/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserUniqueKey } from 'src/enums/user-unique-keys.enum';
import { RefreshTokenRepository } from './refreshTokens.repository';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @InjectRepository(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    signUpCredentialsDto: SignUpCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersRepository.createUser(signUpCredentialsDto);
    const tokens = await this.generateUserTokens({
      username: user.username,
    });
    return tokens;
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = signInCredentialsDto;

    const user = await this.usersRepository.getUserByUniqueKey(
      UserUniqueKey.USERNAME,
      username,
    );
    if (user && (await bcrypt.compare(password, user.password))) {
      const tokens = await this.generateUserTokens({
        username,
      });
      return tokens;
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async generateUserTokens(
    jwtPayload: JwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.jwtService.signAsync(jwtPayload);
    const refreshToken = uuid();

    const user = await this.usersRepository.getUserByUniqueKey(
      UserUniqueKey.USERNAME,
      jwtPayload.username,
    );

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + 60 * 60 * 24 * 7);

    await this.refreshTokenRepository.createRefreshToken(
      refreshToken,
      user,
      expires,
    );

    return { accessToken, refreshToken };
  }

  async refreshTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshTokenSchema =
      await this.refreshTokenRepository.getRefreshTokenSchemaByToken(
        refreshTokenDto.token,
      );

    if (!refreshTokenSchema || refreshTokenSchema.expires < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const newTokens = await this.generateUserTokens({
      username: refreshTokenSchema.user.username,
    });

    await this.refreshTokenRepository.deleteRefreshTokenById(
      refreshTokenSchema.id,
    );

    return newTokens;
  }
}
