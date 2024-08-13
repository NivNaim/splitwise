import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dtos/auth-credentials.dto';
import { Response } from 'express';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ResponseMessage } from 'src/types/response-message.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() signUpCredentialsDto: SignUpCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseMessage> {
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
  ): Promise<ResponseMessage> {
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
  ): Promise<ResponseMessage> {
    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(refreshTokenDto);
    response.cookie('access_token', accessToken);
    response.cookie('refresh_token', refreshToken);
    return { message: 'Tokens refreshed successfully' };
  }
}
