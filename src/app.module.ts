import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { LikesModule } from './likes/likes.module';
import { CommentModule } from './comment/comment.module';
import { AdminModule } from './admin/admin.module';
import { StripeModule } from './stripe/stripe.module';
import { BookmarkModule } from './bookmark/bookmark.module';

@Global()
@Module({
  imports: [AuthModule, PrismaModule, UsersModule, PostModule, LikesModule, CommentModule, AdminModule, StripeModule, BookmarkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
