import { UserRoles } from "src/modules";


export interface IProtectedGuard{
  userId: string;
  role: UserRoles;
}