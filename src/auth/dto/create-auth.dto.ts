import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"
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

export class Otp {
 @ApiProperty({example: "zihadbepari1139@gmail.com"})
 @IsEmail()
 @IsNotEmpty()
  email: string
  
  @ApiProperty({ example: '123456' })
  @IsString()
  otp: string;
}

export class SendEmail {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @ApiProperty({ example: 'strongPassword123' })
  password: string;
}
