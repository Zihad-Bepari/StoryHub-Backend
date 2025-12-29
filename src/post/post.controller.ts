import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
     const { authorId, title, content, likes } = createPostDto;
    return await this.postService.create(authorId, { title, content, likes });
  }
  
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.postService.findAll();
  }
  
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
