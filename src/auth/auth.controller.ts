import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dtos/auth-credentials.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() signUpCredentialsDto: SignUpCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const { accessToken } = await this.authService.signUp(signUpCredentialsDto);
    response.cookie('user_token', accessToken);
    return { message: 'Registration successful' };
  }

  @Post('signin')
  async signIn(
    @Body() signInCredentialsDto: SignInCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const { accessToken } = await this.authService.signIn(signInCredentialsDto);
    response.cookie('user_token', accessToken);
    return { message: 'Login successful' };
  }
}
