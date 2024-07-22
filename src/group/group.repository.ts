import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Group } from './group.schema';
import { CreateGroupDto } from './dtos/create-group.dto';
import { User } from 'src/auth/user.schema';

@Injectable()
export class GroupsRepository extends Repository<Group> {
  constructor(dataSource: DataSource) {
    super(Group, dataSource.createEntityManager());
  }

  async createGroup(
    createGroupDto: CreateGroupDto,
    owner: User,
  ): Promise<Group> {
    const { name } = createGroupDto;

    const group = this.create({
      name,
      owner,
    });

    try {
      return await this.save(group);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Group with name "${name}" already exists`);
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }
}
