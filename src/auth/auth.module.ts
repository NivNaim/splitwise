import { Module } from '@nestjs/common';
import { AuthController } from './users.controller';
import { AuthService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokenRepository } from './refreshTokens.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository, RefreshTokenRepository]),
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: 3600 },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UsersRepository,
    RefreshTokenRepository,
  ],
  exports: [PassportModule, JwtModule, JwtStrategy, UsersRepository],
})
export class AuthModule {}
