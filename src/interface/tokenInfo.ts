import { UserRoles } from "src/modules";


export interface TokenInfo{
  id: string,
  role: UserRoles
}

export interface VerifyToken{
  token: string,
  secretKey: string,
}