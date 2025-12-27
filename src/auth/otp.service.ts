import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MailService } from '@/common/mail/mail.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async generateOtp(email: string): Promise<string> {
  email = email.trim().toLowerCase(); // 🔥 MUST

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const user = await this.prisma.client.users.findFirst({
    where: {
      email: {
        equals: email,
        mode: 'insensitive', // 🔥 KEY
      },
    },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid User');
  }

  await this.prisma.client.users.update({
    where: { id: user.id },
    data: {
      otp,
      otpExpiresAt: expiresAt,
    },
  });

  console.log('OTP SAVED:', otp);

  return otp;
}

}
