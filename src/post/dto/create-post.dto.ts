import { IsNotEmpty, IsNumber, IsOctal, IsString } from "class-validator";

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

}
