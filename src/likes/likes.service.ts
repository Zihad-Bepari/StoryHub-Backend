import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLikeDto: CreateLikeDto) {
  const { userId, postId } = createLikeDto;

  // Fetch user & post
  const user = await this.prisma.client.users.findUnique({
    where: { id: userId },
  });

  const post = await this.prisma.client.createPost.findUnique({
    where: { id: postId },
  });

  if (!user || !post) {
    throw new Error('User or Post not found');
  }

  const existingLike = await this.prisma.client.likes.findFirst({
    where: {
      userId,
      postId,
    },
  });

  if (existingLike) {
    return { message: 'You already liked this post' };
  }

  const like = await this.prisma.client.likes.create({
    data: {
      userId,
      postId,
      username: user.name, 
    },
  });

  const oldLikes = Array.isArray(user.likes) ? user.likes : [];
  const newLikeEntry = {
    postId,
    postTitle: post.title,
    likedAt: new Date(),
  };
  const updatedLikes = [...oldLikes, newLikeEntry];

  const updatedUser = await this.prisma.client.users.update({
    where: { id: userId },
    data: {
      likes: updatedLikes,
      totalLikes: { increment: 1 },
    },
  });

  await this.prisma.client.createPost.update({
    where: { id: postId },
    data: {
      likes: { increment: 1 },
    },
  });

  return {
    message: 'Like added successfully',
    userId: user.id,
    userName: user.name,
    postId: post.id,
    postTitle: post.title,
    totalLikes: updatedUser.totalLikes,
    allLikes: updatedLikes, 
  };
}



  async findAll() {
    return this.prisma.client.likes.findMany({});
  }
}

