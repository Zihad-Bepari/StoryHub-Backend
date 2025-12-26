import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOctal, IsOptional, IsString } from "class-validator";

export class CreatePostDto {

  @ApiProperty({example: 'My First Post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({example: 'This is the content of the post.' })
  @IsString()
  @IsNotEmpty()
  content: string;
  
  @ApiProperty({example: 1 })
  @IsNotEmpty()
  authorId: string; 
  
  @IsNumber()
  @IsOptional()
  likes?: number;
}