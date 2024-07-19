import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() signupCredentialsDto: SignUpCredentialsDto): Promise<void> {
    return this.authService.signup(signupCredentialsDto);
  }
}
