import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsRepository } from './groups.repository';
import { GroupService } from './groups.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([GroupsRepository])],
  controllers: [GroupsController],
  providers: [GroupService, GroupsRepository],
})
export class GroupModule {}
