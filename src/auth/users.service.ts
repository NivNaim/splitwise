import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dtos/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserUniqueKey } from 'src/enums/user-unique-keys.enum';
import { ForgetPasswordDto } from './dtos/forgot-password.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async signUp(
    signUpCredentialsDto: SignUpCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.createUser(signUpCredentialsDto);
    const accessToken = await this.getJwtToken({
      username: user.username,
    });
    return { accessToken };
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = signInCredentialsDto;

    const user = await this.usersRepository.getUserByUniqueKey(
      UserUniqueKey.USERNAME,
      username,
    );
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = await this.getJwtToken({
        username,
      });
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<void> {
    const { email } = forgetPasswordDto;
    const user = await this.usersRepository.getUserByUniqueKey(
      UserUniqueKey.EMAIL,
      email,
    );

    const resetToken = await this.getJwtToken({ username: user.username });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset',
      template: './reset-password',
      context: {
        username: user.username,
        resetToken,
      },
    });
  }

  public async getJwtToken(jwtPayload: JwtPayload): Promise<string> {
    const payload = jwtPayload;
    return this.jwtService.signAsync(payload);
  }
}
