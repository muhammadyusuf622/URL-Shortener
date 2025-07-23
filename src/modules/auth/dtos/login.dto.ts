import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";


export class LoginDto{

  @ApiProperty({type: 'string', example: 'yuvsufn@gmail.com', required: true})
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({type: 'string', example: 'salom', required: true})
  @IsString()
  password: string;
}