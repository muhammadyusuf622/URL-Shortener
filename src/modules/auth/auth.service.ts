import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserRoles } from './models';
import mongoose, { Model } from 'mongoose';
import { LoginDto, RegisterDto } from './dtos';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtHelper } from 'src/helpers';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwt: JwtHelper,
  ) {}

  async onModuleInit() {
    this.seedUser();
  }

  async getAll() {
    const data = await this.userModel.find();

    return {
      message: 'success',
      data: data,
    };
  }

  async register(payload: RegisterDto) {
    const foundUser = await this.userModel.findOne({ email: payload.email });

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const hashPassword = await bcrypt.hash(payload.password, 10);

    const data = await this.userModel.create({
      fullname: payload.fullname,
      email: payload.email,
      password: hashPassword,
    });

    return {
      message: 'success',
      data: data,
    };
  }

  async login(
    payload: LoginDto,
  ): Promise<{ message: string; data: any; accessToken: string }> {
    const foundUser = await this.userModel.findOne({ email: payload.email });

    if (!foundUser) {
      throw new NotFoundException('User Not Found');
    }

    const checkPassword = await bcrypt.compare(
      payload.password,
      foundUser.password,
    );

    if (!checkPassword) {
      throw new BadRequestException('Incorrect password entered');
    }

    const refreshToken = await this.jwt.generateRefreshToken({
      id: foundUser.id,
      role: foundUser.role,
    });

    const accessToken = await this.jwt.generateAccessToken({
      id: foundUser.id,
      role: foundUser.role,
    });

    const updateUser = await this.userModel.findByIdAndUpdate(
      foundUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true },
    );

    return {
      message: 'success',
      data: updateUser,
      accessToken: accessToken,
    };
  }

  async delete(userId: string) {
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID Error Format!');
    }

    const foundUser = await this.userModel.findByIdAndDelete(userId);

    if (!foundUser) {
      throw new NotFoundException('User Not Found!');
    }

    return {
      message: "success"
    }
  }

  async getRefreshToken(token: string){

    const refreshTokenKey = process.env.REFRESH_TOKEN_SECRET_KEY as string;
    const data = await this.jwt.verifyToken({token: token, secretKey: refreshTokenKey});

    const newRefreshToken = await this.jwt.generateRefreshToken({id: data.id, role: data.role});
    const newAccessToken = await this.jwt.generateAccessToken({id: data.id, role: data.role});

    return {
      message: "success",
      token: {
        refreshToken: newRefreshToken,
        accessToken: newAccessToken,
      }
    }
  }


  private async seedUser() {
    try {
      const users = [
        {
          fullname: 'Muhammad Yusuf Nasrulloh',
          email: 'yuvsufn@gmail.com',
          password: 'salom',
          role: UserRoles.ADMIN,
        },
      ];

      for (let user of users) {
        const foundUser = await this.userModel.findOne({ email: user.email });

        if (!foundUser) {
          const hashPassword = await bcrypt.hash(user.password, 10);
          await this.userModel.create({
            fullname: user.fullname,
            email: user.email,
            password: hashPassword,
            role: user.role,
          });
        }
      }

      console.log('☑️ Default admin created');
    } catch (error) {
      console.error('❌ Default user not created');
    }
  }
}
