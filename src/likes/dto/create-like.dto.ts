import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateLikeDto {
    @IsNumber()
    @IsNotEmpty()
    userId: string;
    @IsNumber()
    @IsNotEmpty()
    postId: string;  
}
