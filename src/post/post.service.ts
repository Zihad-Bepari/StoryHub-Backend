import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    return await this.prisma.client.createPost.create({ data: createPostDto });
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
