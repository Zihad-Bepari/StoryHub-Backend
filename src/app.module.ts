import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { LikesModule } from './likes/likes.module';

@Global()
@Module({
  imports: [AuthModule, PrismaModule, UsersModule, PostModule, LikesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
