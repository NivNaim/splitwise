import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from './group/group.module';
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + '/../**/*.entity.js'],
      username: 'postgres',
      password: 'postgres',
      database: 'splitwise',
    }),
    GroupModule,
    ExpenseModule,
  ],
})
export class AppModule {}
