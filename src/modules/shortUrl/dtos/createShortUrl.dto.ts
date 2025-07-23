import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";



export class CreateShortUrlDto {

  @ApiProperty({type: 'string', example: "https://twitting.uz", required: true})
  @IsString()
  orginalUrl: string;

  @ApiProperty({type: 'string', example: 'userId', required: true})
  @IsString()
  userId: string;
}