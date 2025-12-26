import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Role } from "generated/prisma/enums"

export class CreateAuthDto {
        @ApiProperty({example: "ZIhad"})
        @IsString()
        @IsNotEmpty()
        name: string 
        
        @ApiProperty({example: "zihadbepari1139@gmail.com"})
        @IsEmail()
        @IsNotEmpty()
        email: string
        
        @ApiProperty({example: "12345678"})
        @IsString()
        @IsNotEmpty()
        password: string
        
        @IsOptional()
        role?: Role
}

export class Auth {
        @ApiProperty({example: "zihadbepari1139@gmail.com"})
        @IsEmail()
        @IsNotEmpty()
        email: string
        
        @ApiProperty({example: "12345678"})
        @IsString()
        @IsNotEmpty()
        password: string
}
