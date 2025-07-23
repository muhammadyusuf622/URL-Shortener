import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/decoratores";
import { IProtectedGuard } from "src/interface";
import { UserRoles } from "src/modules";

@Injectable()
export class CheckRolesGuard implements CanActivate{
  constructor(private readonly reflector: Reflector){}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request & IProtectedGuard>()

    const roles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
      context.getHandler(), context.getClass(),
    ]);

    let userRole: any = request.role;
    if(!roles || !roles.includes(userRole)){
      throw new ForbiddenException('You cannot perform this action');
    }

    return true
  }
}