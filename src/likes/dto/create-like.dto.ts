import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLikeDto {
  @ApiProperty({
    example: 'b1c2d3e4-1234-5678-9101-acde12345678',
    description: 'User ID',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'post_123456',
    description: 'Post ID',
  })
  @IsString()
  @IsNotEmpty()
  postId: string;  
}
