import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class UsersService {
  
  constructor(private readonly prisma: PrismaService ){

  }
  
  async updateUser(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.client.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.client.users.update({
      where: { id: userId },
      data: {
        ...dto,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isblocked: true,
        updatedAt: true,
      },
    });
  }


   async remove(id: string): Promise<{ message: string }> {
    const user = await this.prisma.client.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.prisma.client.users.delete({ where: { id } });
    return { message: `User with id ${id} deleted successfully` };
  }
}
