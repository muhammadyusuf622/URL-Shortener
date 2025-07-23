import { Body, Controller, Delete, Get, Param, Post, Req, Res } from "@nestjs/common";
import { ShortUrlService } from "./shortUrl.service";
import { Protected, Roles } from "src/decoratores";
import { UserRoles } from "../auth";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CreateShortUrlDto } from "./dtos";
import { Request, Response } from "express";
import { IProtectedGuard } from "src/interface";


@Controller()
export class ShortUrlController{
  constructor(private readonly service: ShortUrlService){};

  @Get()
  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  @ApiOperation({ summary: 'Get all short URLs only admin' })
  async getAll(){
    return await this.service.getAll();
  }

  @Get(':code')
  @Protected(false)
  @Roles([UserRoles.USER])
  async jumpToUrl(@Param('code') code: string, @Req() req: Request & IProtectedGuard, @Res() res: Response){
    return await this.service.jumpToUrl(code, req, res)
  }

  @Get('stats/:code')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.USER, UserRoles.ADMIN])
  @ApiOperation({ summary: 'Get Url Status' })
  async getStats(@Param('code') code: string) {
    return await this.service.getStats(code)
  }

  @Post('shorten')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async create(@Body() body: CreateShortUrlDto){
    return await this.service.create(body);
  }

  @Delete(':id')
  @Protected(true)
  @ApiOperation({ summary: 'Delete Url' })
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  @ApiBearerAuth()
  async delete(@Param('id') id: string){
    return await this.service.deleteUrl(id);
  }
}