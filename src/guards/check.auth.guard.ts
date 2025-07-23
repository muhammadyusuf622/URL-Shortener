import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { PROTECTED_KEY } from "src/decoratores";
import { JwtHelper } from "src/helpers";
import { IProtectedGuard } from "src/interface";
import { UserRoles } from "src/modules";

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwt: JwtHelper){};

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const isProtected = this.reflector.getAllAndOverride<boolean>(
      PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );

    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & IProtectedGuard>();

    if(!isProtected){
      request.role = UserRoles.USER;
      return true
    }

    const bearToken = request.headers['authorization'];


    if(!bearToken || !bearToken.startsWith('Bearer')){
      throw new BadRequestException('Please send me a Bearer token');
    }

    const token = bearToken.split(' ')[1];
    const accessTokenKey = process.env.ACCESS_TOKEN_SECRET_KEY as string;
    const data = await this.jwt.verifyToken({token: token, secretKey: accessTokenKey});

    request.userId = data.id;
    request.role = data.role;

    return true
  }
}