import { CreateGroupDto } from './dtos/create-group.dto';
import {
  BadRequestException,
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
import { transformGroupToDto } from 'src/utils/transform-to-dto.util';
import { TransformedGroupDto } from './dtos/transformed-group.dto';
import { isOwner } from 'src/utils/is-owner.util';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupsRepository)
    private readonly groupsRepository: GroupsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createGroup(
    createGroupDto: CreateGroupDto,
    owner: User,
  ): Promise<TransformedGroupDto> {
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

    const group = await this.groupsRepository.createGroup(
      createGroupDto,
      owner,
      members,
    );

    return transformGroupToDto(group);
  }

  async updateGroup(
    groupId: string,
    updateGroupDto: UpdateGroupDto,
    user: User,
  ): Promise<TransformedGroupDto> {
    const group = await this.groupsRepository.getGroupById(groupId);

    if (!isOwner(user.id, group.owner.id)) {
      throw new ForbiddenException(
        'You are not authorized to update this group',
      );
    }

    const updatedGroup = await this.groupsRepository.updateGroup(
      group,
      updateGroupDto,
    );

    return transformGroupToDto(updatedGroup);
  }

  async getUserGroups(user: User): Promise<Group[]> {
    const groups = await this.groupsRepository.getUserGroups(user);

    if (!groups || groups.length === 0) {
      throw new NotFoundException();
    }

    return groups;
  }

  async addUserToGroup(
    user: User,
    groupId: string,
    userId: string,
  ): Promise<TransformedGroupDto> {
    const userToAdd = await this.usersRepository.getUserByUniqueKey(
      UserUniqueKey.ID,
      userId,
    );

    const existingGroup = await this.groupsRepository.getGroupById(groupId);

    if (
      !isOwner(user.id, existingGroup.owner.id) &&
      !existingGroup.members.some((member) => member.id === user.id)
    ) {
      throw new ForbiddenException(
        'User is not allowed to add members to this group.',
      );
    }

    const updatedGroup = await this.groupsRepository.addUserToGroup(
      existingGroup,
      userToAdd,
    );

    return transformGroupToDto(updatedGroup);
  }

  async removeUserFromGroup(
    user: User,
    groupId: string,
    userId: string,
  ): Promise<TransformedGroupDto> {
    const userToRemove = await this.usersRepository.getUserByUniqueKey(
      UserUniqueKey.ID,
      userId,
    );

    const existingGroup = await this.groupsRepository.getGroupById(groupId);

    if (!isOwner(user.id, existingGroup.owner.id)) {
      throw new ForbiddenException(
        'User is not allowed to add members to this group.',
      );
    }

    if (
      !existingGroup.members.some((member) => member.id === userToRemove.id)
    ) {
      throw new NotFoundException(
        `User with ID '${userId}' is not a member of the group.`,
      );
    }

    const updatedGroup = await this.groupsRepository.removeUserFromGroup(
      existingGroup,
      userToRemove,
    );

    return transformGroupToDto(updatedGroup);
  }

  async deleteGroup(user: User, groupId: string): Promise<void> {
    const existingGroup = await this.groupsRepository.getGroupById(groupId);

    if (!isOwner(user.id, existingGroup.owner.id)) {
      throw new ForbiddenException('Only the owner can delete the group.');
    }

    const unsettledExpenses = existingGroup.expenses.filter(
      (expense) => !expense.isPaid,
    );
    if (unsettledExpenses.length > 0) {
      throw new BadRequestException(
        `All expenses and debts must be settled before deleting the group`,
      );
    }

    await this.groupsRepository.deleteGroupById(existingGroup);
  }
}
