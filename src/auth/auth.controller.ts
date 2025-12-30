import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth, CreateAuthDto, Otp, ResetPasswordDto, SendEmail } from './dto/create-auth.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './strategy/google.guard';
import { GetUser, GetUserEmail, GetUserId } from './strategy/jwt.strategy';

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
  
   @Get('profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: JwtRequest) {
    const email = req.user.email;
    return this.authService.getProfileByEmail(email);
  }
  
   @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req:any) {
    return this.authService.googleLogin(req);
  }
   
  
  @Post('login')
  async login(@Body() dto: Auth) {
    return this.authService.signin(dto);  
  }

  
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('logout')
  async logout(@GetUserEmail() email: string) {
    if (!email) {
      throw new UnauthorizedException('Invalid token or user not found');
    }
    console.log('Logging out user with email:', email);
    return this.authService.logout(email);
  }
}