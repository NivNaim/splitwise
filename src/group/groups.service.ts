import { CreateGroupDto } from './dtos/create-group.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupsRepository } from './groups.repository';
import { Group } from './group.schema';
import { User } from 'src/auth/user.schema';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { UsersRepository } from 'src/auth/users.repository';
import { UserUniqueKey } from 'src/enums/user-unique-keys.enum';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupsRepository)
    private groupsRepository: GroupsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async createGroup(
    createGroupDto: CreateGroupDto,
    owner: User,
  ): Promise<Group> {
    const { usernames } = createGroupDto;

    const members = await this.usersRepository.getUsersByUsernames(usernames);

    return this.groupsRepository.createGroup(createGroupDto, owner, members);
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

  async getGroups(user: User): Promise<Group[]> {
    const groups = await this.groupsRepository.getGroups(user);

    if (!groups || groups.length === 0) {
      throw new NotFoundException();
    }

    return groups;
  }

  async addUser(user: User, userId: string) {
    const userToAdd = await this.usersRepository.getUserByUniqueField(
      UserUniqueKey.ID,
      userId,
    );

    const existingGroup = await this.groupsRepository.getGroupById;
  }
}
