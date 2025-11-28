import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

async create(userId: number, newPost: { title: string; content: string; likes?: number }) {
    return await this.prisma.client.$transaction(async (prisma) => {
        // 1️⃣ Create post in Post table
        const post = await prisma.createPost.create({
            data: {
                title: newPost.title,
                content: newPost.content,
                likes: newPost.likes || 0,
                authorId: userId
            },
        });

        // 2️⃣ Update User table JSON + totalPosts
        const user = await prisma.users.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");

        const postsArray = Array.isArray(user.posts) ? user.posts : [];

        postsArray.push({
            title: post.title,
            content: post.content,
            likes: post.likes
        });

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                posts: postsArray,
                totalPosts: postsArray.length
            },
        });

        return { post, updatedUser };
    });
}

  async findAll() {
    return await this.prisma.client.createPost.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.client.createPost.findUnique({ where: { id } }); 
  }

 async update(id: number, updatePostDto: UpdatePostDto) {
    const userExists = await this.prisma.client.createPost.findUnique({ where: { id } });
        if (!userExists) throw new NotFoundException(`User with ID ${id} not found`);
    
        const updatedUser = await this.prisma.client.createPost.update({
          where: { id },
          data: updatePostDto,
        });
        console.log('User updated:', updatedUser);
        return updatedUser;
  }

  async remove(id: number) {
    return await this.prisma.client.createPost.delete({ where: { id } }); 
  }
}
