import { CreateGroupDto } from './dtos/create-group.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupsRepository } from './group.repository';
import { Group } from './group.schema';
import { User } from 'src/auth/user.schema';
import { UpdateGroupDto } from './dtos/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupsRepository)
    private groupsRepository: GroupsRepository,
  ) {}

  async createGroup(
    createGroupDto: CreateGroupDto,
    owner: User,
  ): Promise<Group> {
    return this.groupsRepository.createGroup(createGroupDto, owner);
  }

  async updateGroup(
    groupId: string,
    updateGroupDto: UpdateGroupDto,
    user: User,
  ): Promise<Group> {
    const group = await this.groupsRepository.getGroupById(groupId);

    if (group.owner.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to update this group',
      );
    }

    Object.assign(group, updateGroupDto);
    return await this.groupsRepository.save(group);
  }
}
