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
import { UpdateGroupDto } from './dtos/update-group.dto';

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

  async updateGroup(
    group: Group,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    Object.assign(group, updateGroupDto);

    try {
      return await this.save(group);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getGroupById(id: string): Promise<Group> {
    let group: Group;
    try {
      group = await this.findOne({
        where: { id },
        relations: ['owner', 'members'],
      });
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

  async addUserToGroup(group: Group, user: User): Promise<Group> {
    if (group.members.some((member) => member.id === user.id)) {
      throw new ConflictException(
        `User '${user.username}' already exist in group '${group.name}'`,
      );
    }
    group.members.push(user);

    try {
      return await this.save(group);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async removeUserFromGroup(group: Group, user: User): Promise<Group> {
    const filteredMembers = group.members.filter(
      (member) => member.id !== user.id,
    );

    Object.assign(group.members, filteredMembers);

    try {
      return await this.save(group);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
