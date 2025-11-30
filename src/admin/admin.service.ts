import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AdminService {
  
  constructor(private readonly prisma : PrismaService){}
  

  async blockUser(userId: number) {
    return this.prisma.client.users.update({
      where: { id: userId },
      data: { isblocked: true },
    });
  }

  async UnblockUser(userId: number) {
    return this.prisma.client.users.update({
      where: { id: userId },
      data: { isblocked: true },
    });
  }

  async remove(post_id: number) {
    return await this.prisma.client.createPost.delete({
      where: { id: post_id },
    });  
  }
}
