import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./models";
import { JwtHelper } from "src/helpers";
import { JwtService } from "@nestjs/jwt";



@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtHelper, JwtService],
  exports: [JwtService, JwtHelper]
})

export class AuthModule {}