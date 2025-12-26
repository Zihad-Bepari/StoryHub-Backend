import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

 async create(
  authorId: string,
  newPost: { title: string; content: string; likes?: number }
) {
  return await this.prisma.client.$transaction(async (prisma) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const postsToday = await prisma.post.count({
      where: {
        authorId,
        createdAt: { gte: today, lt: tomorrow }
      }
    });
   const author = await prisma.users.findUnique({
      where: { id: authorId }, 
      select: { email: true }, 
    });

    if (!author) throw new Error('User not found');

    const authorEmail = author.email;

    const hasPayment = await prisma.payment.findFirst({
      where: {
        userId: authorEmail, 
        status: 'SUCCEEDED',
      }
    });

    if (!hasPayment && postsToday >= 2) {
      throw new BadRequestException(
        'You have reached 2 posts for today. Buy subscription to post more.'
      );
    }

    const post = await prisma.post.create({
      data: {
        title: newPost.title,
        content: newPost.content,
        likes: newPost.likes || 0,
        authorId
      }
    });

    const user = await prisma.users.findUnique({ where: { id: authorId } });
    if (!user) throw new BadRequestException('User not found');

    const postsArray = Array.isArray(user.posts) ? user.posts : [];
    postsArray.push({
      title: post.title,
      content: post.content,
      likes: post.likes
    });

    const updatedUser = await prisma.users.update({
      where: { id: authorId },
      data: {
        posts: postsArray,
        totalPosts: postsArray.length
      }
    });

    return { post, updatedUser };
  });
}


  async findAll() {
    return await this.prisma.client.post.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.client.post.findUnique({ where: { id } }); 
  }

 async update(id: string, updatePostDto: UpdatePostDto) {
    const userExists = await this.prisma.client.post.findUnique({ where: { id } });
        if (!userExists) throw new NotFoundException(`User with ID ${id} not found`);
    
        const updatedUser = await this.prisma.client.post.update({
          where: { id },
          data: updatePostDto,
        });
        console.log('User updated:', updatedUser);
        return updatedUser;
  }

  async remove(id: string) {
    return await this.prisma.client.post.delete({ where: { id } }); 
  }
}
