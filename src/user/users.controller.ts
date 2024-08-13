import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from './schemas/user.schema';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ResponseMessage } from 'src/types/response-message.interface';
import { ForgetPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly authService: UsersService) {}

  @UseGuards(JwtGuard)
  @Patch('change-password')
  async changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseMessage> {
    await this.authService.changePassword(user, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<ResponseMessage> {
    await this.authService.forgotPassword(forgetPasswordDto);
    return { message: 'If the user exists, they will recieve an email' };
  }

  @Patch('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponseMessage> {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'The password has been reset' };
  }
}
