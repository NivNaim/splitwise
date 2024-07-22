import { CreateGroupDto } from './dtos/create-group.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { Cookies } from 'src/auth/decorators/get-jwt.decorator';
import { Group } from './group.schema';
import { GroupService } from './group.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('group')
@UseGuards(JwtGuard)
// @UseGuards(AuthGuard())
export class GroupsController {
  constructor(private groupService: GroupService) {}

  @Post('create-group')
  async createGroup(
    @getUser() user: User,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    return await this.groupService.createGroup(createGroupDto, user);
  }
}
