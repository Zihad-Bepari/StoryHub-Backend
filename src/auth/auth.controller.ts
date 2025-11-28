import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth, CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   @Post('signup')
   signup(@Body() dto: CreateAuthDto){
      return this.authService.signup(dto)
   }
   
   @Post('signin')
   signin(@Body() dto:Auth){
      return this.authService.signin(dto)
   }

   @Post('signout')
  async logout(@Req() req: any) {
    const userId = req.user.userId; 
    return this.authService.signout(userId);
  }
  }
