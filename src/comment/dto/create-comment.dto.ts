import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({
    example: 'post_123456',
    description: 'Post ID',
  })
  @IsString()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({
    example: 'b1c2d3e4-1234-5678-9101-acde12345678',
    description: 'User ID',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'This is a great post!',
    description: 'Comment content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    example: 'Zihad',
    description: 'Username of the commenter (optional)',
  })
  @IsOptional()
  @IsString()
  usrname?: string;
}


export type CommentWithoutPostId = Omit<CreateCommentDto, 'postId'>;
