import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateLikeDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;
    @IsNumber()
    @IsNotEmpty()
    postId: number;  
}
