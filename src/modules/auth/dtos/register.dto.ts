import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";



export class RegisterDto{

  @ApiProperty({type: 'string', example: 'Jhon Doe', required: true})
  @IsString()
  fullname: string;

  @ApiProperty({type: 'string', example: 'jhon@gmail.com', required: true})
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({type: 'string', example: '*********', required: true})
  @MinLength(4)
  @MaxLength(15)
  @IsString()
  password: string;
}