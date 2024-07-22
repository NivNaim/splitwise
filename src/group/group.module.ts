import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GroupsController } from './group.controller';

@Module({
  imports: [AuthModule],
  controllers: [GroupsController],
})
export class GroupModule {}
