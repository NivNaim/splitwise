import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsModule } from './group/groups.module';
import { ExpensesModule } from './expense/expenses.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { Group } from './group/group.schema';
import { Expense } from './expense/expense.schema';
import { User } from './auth/schemas/user.schema';
import { RefreshToken } from './auth/schemas/refresh-token.schema';

@Module({
  imports: [
    AuthModule,
    GroupsModule,
    ExpensesModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: configService.get('DB_SYNCHRONIZE'),
        entities: [User, RefreshToken, Group, Expense],
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
