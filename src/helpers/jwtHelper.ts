import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { TokenInfo, VerifyToken } from "src/interface";


@Injectable()
export class JwtHelper {
  constructor(private readonly jwt: JwtService){};

  async generateRefreshToken(payload: TokenInfo){
    
    const token = await this.jwt.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: process.env.REFRESH_SECRET_TIME,
    });

    return token;
  }

  async generateAccessToken(payload: TokenInfo){

    const token = await this.jwt.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: process.env.ACCESS_SECRET_TIME,
    })

    return token;
  }

  async verifyToken(payload: VerifyToken){

    try {
      const openToken = await this.jwt.verifyAsync(payload.token, {secret: payload.secretKey});
      return openToken;
    } catch (error) {
      if(error instanceof JsonWebTokenError){
        throw new BadRequestException('no such token found');
      }

      if(error instanceof TokenExpiredError){
        throw new ForbiddenException('token time out');
      }

      throw new InternalServerErrorException("server error");
    }
  }
}