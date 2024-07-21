import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dtos/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(signUpCredentialsDto);
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = signInCredentialsDto;

    const user = await this.usersRepository.getUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { userId: user.id, username: user.username };
      return { accessToken: await this.jwtService.signAsync(payload) };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
