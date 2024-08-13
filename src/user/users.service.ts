import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../user/repositories/users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserUniqueKey } from 'src/enums';
import { ChangePasswordDto } from '../user/dtos/change-password.dto';
import { User } from '../user/schemas/user.schema';
import { ForgetPasswordDto } from '../user/dtos/forgot-password.dto';
import { nanoid } from 'nanoid';
import { ResetTokenRepository } from '../user/repositories/resetTokens.repository';
import { ResetPasswordDto } from '../user/dtos/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @InjectRepository(ResetTokenRepository)
    private readonly resetTokenRepository: ResetTokenRepository,
  ) {}

  async changePassword(
    user: User,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { oldPassword, newPassword } = changePasswordDto;

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new UnauthorizedException('Please check your credentials');
    }

    await this.usersRepository.updateUserPassword(user, newPassword);
  }

  async forgotPassword(forgetPasswordDto: ForgetPasswordDto): Promise<void> {
    const user = await this.usersRepository.GetUserByUniqueKey(
      UserUniqueKey.EMAIL,
      forgetPasswordDto.email,
    );

    if (user) {
      const expires = new Date();
      expires.setHours(expires.getHours() + 1);

      const resetToken = nanoid(64);
      await this.resetTokenRepository.createResetTokenSchema(
        resetToken,
        user,
        expires,
      );

      //TODO: Send the link to the user by email (using nodemailer/ SES /etc...)
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { resetToken, newPassword } = resetPasswordDto;
    const resetTokenSchema =
      await this.resetTokenRepository.getResetTokenSchemaByToken(resetToken);

    if (!resetTokenSchema) {
      throw new UnauthorizedException('Invalid link');
    }

    await this.usersRepository.updateUserPassword(
      resetTokenSchema.user,
      newPassword,
    );

    await this.resetTokenRepository.deleteResetTokenById(resetTokenSchema.id);
  }
}
