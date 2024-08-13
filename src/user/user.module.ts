import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './repositories/users.repository';
import { ResetTokenRepository } from './repositories/resetTokens.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UsersRepository, ResetTokenRepository]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, ResetTokenRepository],
  exports: [UsersRepository],
})
export class UserModule {}
