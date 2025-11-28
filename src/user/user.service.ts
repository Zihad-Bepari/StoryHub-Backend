import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

// export function shmaim() {
//   return function (
//     target: any,
//     propertyKey: string,
//     descriptor: PropertyDescriptor,
//   ) {
//     const originalMethod = descriptor.value;

//     descriptor.value = async function (...args: any[]) {
//       console.log("shamim login 2nd");
//       return await originalMethod.apply(this, args);
//     };

//     console.log("shamim login 1st");
//   };
// }

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDtos: CreateUserDto) {
    const existingUser = await this.prisma.client.user.findFirst({
      where: { email: createUserDtos.email },
    });

    if (existingUser) {
      throw new HttpException('user already exist', 409);
    }

    return await this.prisma.client.user.create({ data: createUserDtos });
  }

  // @shmaim()
  async justCheck() {
    return 'decorate success';
  }
}
