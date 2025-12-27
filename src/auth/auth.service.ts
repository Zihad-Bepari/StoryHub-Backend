import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Auth, CreateAuthDto, Otp } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { OtpService } from './otp.service';
import { MailService } from '@/common/mail/mail.service';

@Injectable()
export class AuthService {
  constructor (
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,   ){

  }
  
async signup(dto: CreateAuthDto) {

  const email = dto.email.trim().toLowerCase(); // 🔥 IMPORTANT

  const existingUser = await this.prisma.client.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new BadRequestException('User already exist. please login.');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = await this.prisma.client.users.create({
    data: {
      name: dto.name,
      email, 
      password: hashedPassword,
      role: dto.role ?? 'USER',
    },
  });

  const otp = await this.otpService.generateOtp(email);

  await this.mailService.sendOtp(email, otp);

  return {
    message: 'Register successful. Please verify your email.',
  };
}

async verifyOtp(dto: Otp) {
      const email = dto.email; 
      const otp = dto.otp;

      const user = await this.prisma.client.users.findUnique({
        where: { email },
      });
      console.log(user)
       

      if (user?.otp !== otp) {
        throw new UnauthorizedException('OTP does not match');
      }

      if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
        throw new UnauthorizedException('OTP expired');
      }

      await this.prisma.client.users.update({
        where: { email },
        data: {
          otp: null,
          otpExpiresAt: null,
          isEmailVerified: true
        },
      });

      return { message: 'OTP verified successfully' };
   }
   
async resendOtp(email: string) {
    const otp = await this.otpService.generateOtp(email);

      await this.mailService.sendOtp(email, otp);

      return { message: 'OTP resent successfully' };
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
    
    if (!user.isEmailVerified) {
      throw new HttpException(
        { message: "Please verify your email before login." },
        HttpStatus.FORBIDDEN,
      );
    }


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
    return { message: 'Signin successful', token, id:user.id,email:user.email };
}

 async forgetPassword(email: string) {
    const user = await this.prisma.client.users.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid User');

    const otp = await this.otpService.generateOtp(email);
    await this.mailService.forgetPassOtp(email, otp);

    return {
      message:
        'OTP sent to your email. Please verify it to Forget your password.',
    };
  }

  async verifyForgotOtp(otp: string) {
    const user = await this.prisma.client.users.findFirst({
      where: { otp },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('OTP expired');
    }
    return {
      message: 'OTP verified successfully. You can now reset password.',
    };
  }

  async resetPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.client.users.updateMany({
      data: { password: hashedPassword },
    });
    return {
      message: 'Reset Your Password successfully',
    };
  }
  
  async getProfileByEmail(email: string) {
    const user = await this.prisma.client.users.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

}
