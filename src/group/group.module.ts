import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GroupsController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsRepository } from './group.repository';
import { GroupService } from './group.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([GroupsRepository])],
  controllers: [GroupsController],
  providers: [GroupService, GroupsRepository],
})
export class GroupModule {}
