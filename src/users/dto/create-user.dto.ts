import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Role } from "generated/prisma/enums";

export class CreateUserDto {
    
    @ApiProperty({example: "ghdytfdty"})
    @IsString()
    @IsNotEmpty()
    name: string
    
    @IsEmail()
    @IsNotEmpty()
    email: string
    
    @IsString()
    @IsNotEmpty()
    password: string
    
    @IsOptional()
    role?: Role
    ///gkshdkgjhdg
}
