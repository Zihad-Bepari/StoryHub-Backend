import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AdminService {
  
  constructor(private readonly prisma : PrismaService){}
  

  async blockUser(userId: string) {
    return this.prisma.client.users.update({
      where: { id: userId },
      data: { isblocked: true },
    });
  }
  
  async UnblockUser(userId: string) {
    return this.prisma.client.users.update({
      where: { id: userId },
      data: { isblocked: true },
    });
  }
  
  async remove(post_id: string) {
    return await this.prisma.client.post.delete({
      where: { id: post_id },
    });  
  }
  
    async findAll() {
        const users = await this.prisma.client.users.findMany();
        return users;
    }
  
    async findOne(id: string) {
      const user = await this.prisma.client.users.findUnique({ where: { id } });
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);
      return user;
    }
    
}
