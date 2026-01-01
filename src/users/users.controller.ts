import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Patch('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  updateProfile(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.user.id;
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
