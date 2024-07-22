import { CreateGroupDto } from './dtos/create-group.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupsRepository } from './group.repository';
import { Group } from './group.schema';
import { User } from 'src/auth/user.schema';

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
}
