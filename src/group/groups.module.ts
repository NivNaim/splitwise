import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsRepository } from './groups.repository';
import { GroupsService } from './groups.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([GroupsRepository])],
  controllers: [GroupsController],
  providers: [GroupsService, GroupsRepository],
  exports: [GroupsRepository],
})
export class GroupsModule {}
