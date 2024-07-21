import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignUpCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(signupCredentialsDto: SignUpCredentialsDto): Promise<void> {
    const { username, email, password } = signupCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: User = this.create({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUserByUsername(username: string): Promise<User> {
    try {
      return await this.findOne({ where: { username } });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
