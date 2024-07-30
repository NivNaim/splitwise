import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignUpCredentialsDto } from './dtos/auth-credentials.dto';
import { User } from './user.schema';
import {
  isUserUniqueKey,
  UserUniqueKey,
} from 'src/enums/user-unique-keys.enum';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(signupCredentialsDto: SignUpCredentialsDto): Promise<User> {
    const { username, email, password } = signupCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: User = this.create({
      username,
      email,
      password: hashedPassword,
    });

    try {
      return await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUserByUniqueKey(
    uniqueKey: UserUniqueKey,
    value: string,
  ): Promise<User> {
    let user: User;

    if (!isUserUniqueKey(uniqueKey)) {
      throw new BadRequestException(`Invalid unique key "${uniqueKey}"`);
    }

    try {
      user = await this.findOne({ where: { [uniqueKey]: value } });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!user) {
      throw new NotFoundException(
        `User with ${uniqueKey} "${value}" not found`,
      );
    }

    return user;
  }

  async getUsersByUsernames(usernames: string[]): Promise<User[]> {
    if (!usernames || usernames.length === 0) {
      throw new NotFoundException(`No usernames provided`);
    }

    let users: User[];

    try {
      users = await this.find({ where: { username: In(usernames) } });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!users || users.length === 0) {
      throw new NotFoundException(`Users with provided usernames not found`);
    }

    return users;
  }
}
