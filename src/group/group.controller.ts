import { CreateGroupDto } from './dtos/create-group.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { Cookies } from 'src/auth/decorators/get-jwt.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('group')
@UseGuards(JwtGuard)
export class GroupsController {
  @Post('create-group')
  async createGroup(
    @Cookies('user_token') jwt: string,
    @getUser() user: User,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    console.log(jwt);
  }
}
