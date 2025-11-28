import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Auth, CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor (private readonly prisma: PrismaService ){

  }
  
  async signup(dto: CreateAuthDto){
    
     const existingUser = await this.prisma.client.users.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.client.users.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role ?? 'USER', 
      },
    });
    
  
    console.log('User created:', user);
    return { message: 'Signup successful', user };
  }

  async signin(dto: Auth){  
    const user = await this.prisma.client.users.findUnique({
      where:{
         email: dto.email
      }
    });

    if(!user) {
      throw new HttpException(
            { message: "User Not Found" },
            HttpStatus.BAD_REQUEST,
        );
    }
    
    //const hashedPassword = await bcrypt.hash(dto.password, 10);
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new HttpException(
              { message: "Wrong password!" },
              HttpStatus.BAD_REQUEST,
          );
    }
    const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'StoryHub',
    { expiresIn: '1d' },
  );
    return { message: 'Signin successful', token, user };
  }

  async signout(userId :string ){
     return { message: 'Logout successful' };
  }
  
}
