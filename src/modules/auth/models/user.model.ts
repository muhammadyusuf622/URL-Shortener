import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";

export type UserDocument = User & Document;

export enum UserRoles {
  ADMIN = "ADMIN",
  USER = "USER"
}

@Schema({collection: 'users', timestamps: true, versionKey: false})
export class User{

  @Prop({type: SchemaTypes.String, required: true})
  fullname: string;

  @Prop({type: SchemaTypes.String, required: true, unique: true})
  email: string;

  @Prop({type: SchemaTypes.String, required: true})
  password: string;

  @Prop({type: SchemaTypes.String, required: false, default: null})
  refreshToken: string;

  @Prop({type: SchemaTypes.String, enum: UserRoles, default: UserRoles.USER})
  role: UserRoles;
  
}

export const UserSchema = SchemaFactory.createForClass(User);