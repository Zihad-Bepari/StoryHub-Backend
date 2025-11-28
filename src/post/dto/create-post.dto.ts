import { IsNotEmpty, IsNumber, IsOctal, IsOptional, IsString } from "class-validator";

export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;
    
    @IsNumber()
    @IsNotEmpty()
    authorId: number; 
    
    @IsNumber()
    @IsOptional()
    likes?: number;

}
