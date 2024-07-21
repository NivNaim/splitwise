import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dto/auth-credentials.dto';
import { Response } from 'express';
import { Cookies } from './get-jwt.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
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
