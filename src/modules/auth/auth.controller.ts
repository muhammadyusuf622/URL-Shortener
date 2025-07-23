import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dtos";
import { Protected, Roles } from "src/decoratores";
import { ApiBearerAuth, ApiBody, ApiOperation } from "@nestjs/swagger";
import { UserRoles } from "./models";


@Controller('auth')
export class AuthController{
  constructor(private readonly service: AuthService){};

  @Get()
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all Users only admin' })
  async getAll(){
    return await this.service.getAll();
  }

  @Post('register')
  @Protected(false)
  @Roles([UserRoles.USER])
  async register(@Body() payload: RegisterDto){
    return await this.service.register(payload);
  }

  @Post('login')
  @Protected(false)
  @Roles([UserRoles.USER])
  async login(@Body() payload: LoginDto){
    return await this.service.login(payload);
  }

  @Post('refresh-token')
  @Protected(false)
  @Roles([UserRoles.USER])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        }
      },
      required: ['refreshToken'],
    }
  })
  async getRefreshToken(@Body() body: { refreshToken: string }){
    return await this.service.getRefreshToken(body.refreshToken);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async delete(@Param('id') id: string){
    return await this.service.delete(id);
  }
}