import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}
  
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post()
  create(@Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarkService.create(createBookmarkDto);
  }
  
  
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.bookmarkService.findAll();
  }
  
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookmarkService.findOne(id);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookmarkService.remove(id);
  }
}