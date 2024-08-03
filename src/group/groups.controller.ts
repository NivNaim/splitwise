import { UpdateGroupDto } from './dtos/update-group.dto';
import { CreateGroupDto } from './dtos/create-group.dto';
import {
  Body,
  Controller,
  Delete,
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

@Controller('group')
@UseGuards(JwtGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async createGroup(
    @getUser() user: User,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<TransformedGroupDto> {
    return await this.groupsService.createGroup(createGroupDto, user);
  }

  @Patch(':id')
  async updateGroup(
    @Param('id') id: string,
    @getUser() user: User,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<TransformedGroupDto> {
    return await this.groupsService.updateGroup(id, updateGroupDto, user);
  }

  @Get()
  async getUserGroups(@getUser() user: User): Promise<Group[]> {
    return await this.groupsService.getUserGroups(user);
  }

  @Post('add-user/:groupId/:userId')
  async addUserToGroup(
    @getUser() user: User,
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<TransformedGroupDto> {
    return await this.groupsService.addUserToGroup(user, groupId, userId);
  }

  @Patch('remove-user/:groupId/:userId')
  async removeUserFromGroup(
    @getUser() user: User,
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<TransformedGroupDto> {
    return await this.groupsService.removeUserFromGroup(user, groupId, userId);
  }

  @Delete(':id')
  async deleteGroup(
    @getUser() user: User,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    await this.groupsService.deleteGroup(user, id);
    return { message: `Group '${id} deleted successfully` };
  }
}
