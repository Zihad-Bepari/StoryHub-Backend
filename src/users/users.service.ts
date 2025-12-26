import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class UsersService {
  
  constructor(private readonly prisma: PrismaService ){

  }
  
 async update(id: string, updateUserDto: UpdateUserDto) {
    const userExists = await this.prisma.client.users.findUnique({ where: { id } });
    if (!userExists) throw new NotFoundException(`User with ID ${id} not found`);

    const updatedUser = await this.prisma.client.users.update({
      where: { id },
      data: updateUserDto,
    });
    console.log('User updated:', updatedUser);
    return updatedUser;
  }

  async remove(id: string) {
      console.log("Deleted id : ");

     const userExists = await this.prisma.client.users.findUnique({ where: { id } });
    if (!userExists) throw new NotFoundException(`User with ID ${id} not found`);

    const deletedUser = await this.prisma.client.users.delete({ where: { id } });
    console.log('User deleted:', deletedUser);
    return deletedUser;
  }
}
