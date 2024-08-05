import { Body, Controller, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dtos/auth-credentials.dto';
import { ForgetPasswordDto } from './dtos/forgot-password.dto';
import { Response } from 'express';

@Controller('user')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async signUp(
    @Body() signUpCredentialsDto: SignUpCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const { accessToken } =
      await this.usersService.signUp(signUpCredentialsDto);
    response.cookie('user_token', accessToken);
    return { message: 'Registration successful' };
  }

  @Post('login')
  async signIn(
    @Body() signInCredentialsDto: SignInCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const { accessToken } =
      await this.usersService.signIn(signInCredentialsDto);
    response.cookie('user_token', accessToken);
    return { message: 'Login successful' };
  }

  @Post('forget')
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<{ message: string }> {
    await this.usersService.forgetPassword(forgetPasswordDto);
    return { message: 'Password reset email sent' };
  }
}
