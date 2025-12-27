import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth, CreateAuthDto, Otp, ResetPasswordDto, SendEmail } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

interface JwtRequest extends Request {
  user: {
    sub: string;
    email: string;
    role?: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   @Post('Register')
   signup(@Body() dto: CreateAuthDto){
      return this.authService.signup(dto)
   } 
   
   @Post('verify-otp')
   @ApiOperation({ summary: 'verify otp' })
   verifyOtp(@Body() otp: Otp) {
      return this.authService.verifyOtp(otp)
   }
   
   @Post('resend-otp')
   async resendOtp(@Body() dto: SendEmail) {
       return this.authService.resendOtp(dto.email);
   }
   
   @Post('forgetpassword')
  @ApiOperation({ summary: 'Forget Password' })
  forgetpassword(@Body() login: SendEmail) {
     return this.authService.forgetPassword(login.email)
  }

  @Post('verify-forgot-otp')
  @ApiOperation({ summary: 'verify otp' })
  verifyForgotOtp(@Body() otp: Otp) {
    return this.authService.verifyForgotOtp(otp.otp)
  }
  
   @Post('reset-password')
  @ApiOperation({ summary: 'Reset password without OTP or ID' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.password)
  }
  
  @Post('Login')
   signin(@Body() dto:Auth){
      return this.authService.signin(dto)
   }
   

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: JwtRequest) {
    const email = req.user.email;
    return this.authService.getProfileByEmail(email);
  }

  }
