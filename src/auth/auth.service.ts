import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import { SignUpCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async signup(signupCredentialsDto: SignUpCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(signupCredentialsDto);
  }
}
