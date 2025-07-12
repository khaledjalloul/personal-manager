import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { GroupsModule } from './groups/groups.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    GroupsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
