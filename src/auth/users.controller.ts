import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './users.service';
import {
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dtos/auth-credentials.dto';
import { Response } from 'express';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('user')
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
}
