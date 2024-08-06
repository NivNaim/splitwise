import { Body, Controller, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dtos/auth-credentials.dto';
import { Response } from 'express';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { JwtGuard } from './jwt.guard';
import { GetUser } from './get-user.decorator';
import { User } from './schemas/user.schema';
import { ForgetPasswordDto } from './dtos/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signUp(
    @Body() signUpCredentialsDto: SignUpCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const { accessToken, refreshToken } =
      await this.authService.signUp(signUpCredentialsDto);
    response.cookie('access_token', accessToken);
    response.cookie('refresh_token', refreshToken);
    return { message: 'Registration successful' };
  }

  @Post('signin')
  async signIn(
    @Body() signInCredentialsDto: SignInCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const { accessToken, refreshToken } =
      await this.authService.signIn(signInCredentialsDto);
    response.cookie('access_token', accessToken);
    response.cookie('refresh_token', refreshToken);
    return { message: 'Login successful' };
  }

  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(refreshTokenDto);
    response.cookie('access_token', accessToken);
    response.cookie('refresh_token', refreshToken);
    return { message: 'Tokens refreshed successfully' };
  }

  @UseGuards(JwtGuard)
  @Patch('change-password')
  async changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.changePassword(user, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.forgotPassword(forgetPasswordDto);
    return { message: 'If the user exists, they will recieve an email' };
  }
}
