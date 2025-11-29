import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNumber()
    @IsNotEmpty()
    postId: number;
    @IsNumber()
    @IsNotEmpty()
    userId: number;
    @IsNotEmpty()
    @IsString()
    content: string;
    
    @IsOptional()
    @IsString()
    usrname?: string;
}

export type CommentWithoutPostId = Omit<CreateCommentDto, 'postId'>;
