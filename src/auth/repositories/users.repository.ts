import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { SignUpCredentialsDto } from '../dtos/auth-credentials.dto';
import { User } from '../schemas/user.schema';
import {
  isUserUniqueKey,
  UserUniqueKey,
} from 'src/enums/user-unique-keys.enum';
import { hashPassword } from 'src/utils/hash-password.util';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(signupCredentialsDto: SignUpCredentialsDto): Promise<User> {
    const { username, email, password } = signupCredentialsDto;

    const hashedPassword = await hashPassword(password);

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

  async GetUserByUniqueKey(
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

  async GetUsersByUsernames(usernames: string[]): Promise<User[]> {
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

  async updateUserPassword(user: User, newPassword: string): Promise<void> {
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    try {
      await this.save(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
