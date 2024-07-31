import { UpdateGroupDto } from './dtos/update-group.dto';
import { CreateGroupDto } from './dtos/create-group.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { Group } from './group.schema';
import { GroupsService } from './groups.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { TransformedGroupDto } from './dtos/transformed-group.dto';
import { transformGroupToDto } from 'src/utils/transform-to-dto.util';

@Controller('group')
@UseGuards(JwtGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async createGroup(
    @getUser() user: User,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<TransformedGroupDto> {
    const group = await this.groupsService.createGroup(createGroupDto, user);
    return transformGroupToDto(group);
  }

  @Patch(':id')
  async updateGroup(
    @Param('id') id: string,
    @getUser() user: User,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<TransformedGroupDto> {
    const group = await this.groupsService.updateGroup(
      id,
      updateGroupDto,
      user,
    );
    return transformGroupToDto(group);
  }

  @Get()
  async getGroups(@getUser() user: User): Promise<Group[]> {
    return await this.groupsService.getGroups(user);
  }

  @Post('add-user/:groupId/:userId')
  async addUserToGroup(
    @getUser() user: User,
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<TransformedGroupDto> {
    const group = await this.groupsService.addUserToGroup(
      user,
      groupId,
      userId,
    );
    return transformGroupToDto(group);
  }

  @Patch('remove-user/:groupId/:userId')
  async removeUserFromGroup(
    @getUser() user: User,
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<TransformedGroupDto> {
    const group = await this.groupsService.removeUserFromGroup(
      user,
      groupId,
      userId,
    );
    return transformGroupToDto(group);
  }
}
