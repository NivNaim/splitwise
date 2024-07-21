import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dtos/auth-credentials.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() signUpCredentialsDto: SignUpCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(signUpCredentialsDto);
  }

  @Post('/signin')
  async signIn(
    @Body() signInCredentialsDto: SignInCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken } = await this.authService.signIn(signInCredentialsDto);
    response.cookie('jwt', accessToken, { httpOnly: true, secure: true });
    return { accessToken };
  }
}
