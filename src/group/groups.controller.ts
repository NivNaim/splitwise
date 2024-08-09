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
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { Group } from './group.schema';
import { GroupsService } from './groups.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { TransformedGroupDto } from './dtos/transformed-group.dto';
import { ResponseMessage } from 'src/types/response-message.interface';

@Controller('group')
@UseGuards(JwtGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async createGroup(
    @GetUser() user: User,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<TransformedGroupDto> {
    return await this.groupsService.createGroup(createGroupDto, user);
  }

  @Patch(':id')
  async updateGroup(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<TransformedGroupDto> {
    return await this.groupsService.updateGroup(id, updateGroupDto, user);
  }

  @Get()
  async GetUserGroups(@GetUser() user: User): Promise<Group[]> {
    return await this.groupsService.GetUserGroups(user);
  }

  @Post('add/:groupId/:userId')
  async addUserToGroup(
    @GetUser() user: User,
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<TransformedGroupDto> {
    return await this.groupsService.addUserToGroup(user, groupId, userId);
  }

  @Patch('remove/:groupId/:userId')
  async removeUserFromGroup(
    @GetUser() user: User,
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<TransformedGroupDto> {
    return await this.groupsService.removeUserFromGroup(user, groupId, userId);
  }

  @Delete('remove/:id')
  async deleteGroup(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<ResponseMessage> {
    await this.groupsService.deleteGroup(user, id);
    return { message: `Group '${id} deleted successfully` };
  }

  @Get('min-transactions/:id')
  async getMinTransactions(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<ResponseMessage> {
    const minTransfers = await this.groupsService.getMinTransfers(user, id);
    return {
      message: `Minimum transactions needed to settle debts: ${minTransfers}`,
    };
  }
}
