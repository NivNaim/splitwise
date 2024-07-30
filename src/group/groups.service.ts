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

    if (members.length !== usernames.length) {
      const foundUsernames = members.map((member) => member.username);
      const notFoundUsernames = usernames.filter(
        (username) => !foundUsernames.includes(username),
      );
      throw new NotFoundException(
        `Users not found for the following usernames: ${notFoundUsernames.join(', ')}`,
      );
    }

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

    return await this.groupsRepository.updateGroup(group, updateGroupDto);
  }

  async getGroups(user: User): Promise<Group[]> {
    const groups = await this.groupsRepository.getGroups(user);

    if (!groups || groups.length === 0) {
      throw new NotFoundException();
    }

    return groups;
  }

  async addUserToGroup(
    user: User,
    groupId: string,
    userId: string,
  ): Promise<Group> {
    const userToAdd = await this.usersRepository.getUserByUniqueKey(
      UserUniqueKey.ID,
      userId,
    );

    const existingGroup = await this.groupsRepository.getGroupById(groupId);

    if (
      user.id !== existingGroup.owner.id &&
      !existingGroup.members.some((member) => member.id === user.id)
    ) {
      throw new ForbiddenException(
        'User is not allowed to add members to this group.',
      );
    }

    return await this.groupsRepository.addUserToGroup(existingGroup, userToAdd);
  }

  async removeUserFromGroup(
    user: User,
    groupId: string,
    userId: string,
  ): Promise<Group> {
    const userToRemove = await this.usersRepository.getUserByUniqueKey(
      UserUniqueKey.ID,
      userId,
    );

    const existingGroup = await this.groupsRepository.getGroupById(groupId);

    if (user.id !== existingGroup.owner.id) {
      throw new ForbiddenException(
        'User is not allowed to add members to this group.',
      );
    }

    return await this.groupsRepository.removeUserFromGroup(
      existingGroup,
      userToRemove,
    );
  }
}
