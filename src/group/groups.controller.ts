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
import { GroupService } from './groups.service';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('group')
@UseGuards(JwtGuard)
export class GroupsController {
  constructor(private groupService: GroupService) {}

  @Post()
  async createGroup(
    @getUser() user: User,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    return await this.groupService.createGroup(createGroupDto, user);
  }

  @Patch(':id')
  async updateGroup(
    @Param('id') id: string,
    @getUser() user: User,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    return await this.groupService.updateGroup(id, updateGroupDto, user);
  }

  @Get()
  async getGroups(@getUser() user: User): Promise<Group[]> {
    return await this.groupService.getGroups(user);
  }

  @Post('add-user/:id/:userId')
  async addUser(
    @getUser() user: User,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return await this.groupService.addUser(user, userId);
  }
}
