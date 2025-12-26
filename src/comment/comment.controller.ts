import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
     const { postId, 
        ...commentData
      } = createCommentDto;
     return this.commentService.create(postId, commentData);
  }

   @Patch(':postId/:index')
  update(
    @Param('postId', ParseIntPipe) postId: string,
    @Param('index', ParseIntPipe) index: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(postId, index, updateCommentDto);
  }

  @Delete(':postId/:index')
  remove(
    @Param('postId', ParseIntPipe) postId: string,
    @Param('index', ParseIntPipe) index: number,
  ) {
    return this.commentService.remove(postId, index);
  }
}
