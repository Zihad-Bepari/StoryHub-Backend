import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class UsersService {
  
  constructor(private readonly prisma: PrismaService ){

  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.client.users.findFirst({
        where: { email: dto.email },
    });

    if (existingUser) {
        throw new HttpException('user already exist', 400);
    }

    return await this.prisma.client.users.create({ data: dto });
   }


  async justCheck() {
    return 'decorate success';
  }


  async findAll() {
    const users = await this.prisma.client.users.findMany();
    console.log('All users fetched:', users.length);
    return users
  }

  async findOne(id: number) {
        console.log("get by id : ");
    const user = await this.prisma.client.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

 async update(id: number, updateUserDto: UpdateUserDto) {
          console.log("Update by id : ");
    const userExists = await this.prisma.client.users.findUnique({ where: { id } });
    if (!userExists) throw new NotFoundException(`User with ID ${id} not found`);

    const updatedUser = await this.prisma.client.users.update({
      where: { id },
      data: updateUserDto,
    });
    console.log('User updated:', updatedUser);
    return updatedUser;
  }

  async remove(id: number) {
      console.log("Deleted id : ");

     const userExists = await this.prisma.client.users.findUnique({ where: { id } });
    if (!userExists) throw new NotFoundException(`User with ID ${id} not found`);

    const deletedUser = await this.prisma.client.users.delete({ where: { id } });
    console.log('User deleted:', deletedUser);
    return deletedUser;
  }
}
