import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
    members: User[] = [],
  ): Promise<Group> {
    const { name, description } = createGroupDto;

    const group = this.create({
      name,
      owner,
      description,
      members: [owner, ...members],
    });

    try {
      return await this.save(group);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Group with name "${name}" already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getGroupById(id: string): Promise<Group> {
    let group: Group;
    try {
      group = await this.findOne({ where: { id }, relations: ['owner'] });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!group) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }

    return group;
  }

  async getGroups(user: User): Promise<Group[]> {
    const query = this.createQueryBuilder('group').innerJoin(
      'group.members',
      'member',
      'member.id = :userId',
      { userId: user.id },
    );

    try {
      const groups = await query.getMany();
      return groups;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
