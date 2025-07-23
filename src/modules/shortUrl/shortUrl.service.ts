import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlDocument } from './models';
import { Model, Types } from 'mongoose';
import { CreateShortUrlDto } from './dtos';
import { User, UserDocument } from '../auth';
import * as moment from 'moment';
import { nanoid } from 'nanoid';
import { Request, Response } from 'express';
import { IProtectedGuard } from 'src/interface';

@Injectable()
export class ShortUrlService {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<UrlDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getAll() {
    const data = await this.urlModel.find();

    return {
      message: 'success',
      data: data,
    };
  }

  async create(payload: CreateShortUrlDto) {
    if (!Types.ObjectId.isValid(payload.userId)) {
      throw new BadRequestException('Invalid userId format');
    }

    const founUser = await this.userModel.findById(payload.userId);

    if (!founUser) {
      throw new BadRequestException('User Not Found UserId Error');
    }

    const foundUrl = await this.urlModel.findOne({
      orginalUrl: payload.orginalUrl,
    });

    if (foundUrl) {
      throw new BadRequestException('Used this url before');
    }

    let nanoidCod = nanoid(8);

    const newUrl = await this.urlModel.create({
      orginalUrl: payload.orginalUrl,
      shortCode: nanoidCod,
      userId: payload.userId,
    });

    const BASE_SERVER_URL = process.env.BASE_SERVER_URL as string;
    const PORT = parseInt(process.env.APP_PORT as string) || 3000;
    return {
      message: 'success',
      data: {
        _id: newUrl._id,
        orginalUrl: newUrl.orginalUrl,
        shortCode: BASE_SERVER_URL + PORT + '/' + newUrl.shortCode,
        viewersCount: newUrl.viewersCount,
        createdAt: moment(newUrl.createdAt).format('DD.MM.YYYY HH:mm'),
        expiresAt: moment(newUrl.expiresAt).format('DD.MM.YYYY HH:mm'),
      },
    };
  }

  async getStats(shortCode: string) {
    const findUrl = await this.urlModel.findOne({ shortCode: shortCode });

    if (!findUrl) {
      throw new NotFoundException('No such URL exists');
    }

    let warn:any;
    const now = new Date();
    if (findUrl.expiresAt && now > findUrl.expiresAt) {
      warn = 'This short URL has expired';
    }

    return {
      message: 'success',
      data: {
        _id: findUrl._id,
        orginalUrl: findUrl.orginalUrl,
        shortCode: findUrl.shortCode,
        viewersCount: findUrl.viewersCount,
        createdAt: moment(findUrl.createdAt).format('DD.MM.YYYY HH:mm'),
        expiresAt: moment(findUrl.expiresAt).format('DD.MM.YYYY HH:mm'),
        warning: warn,
      },
    };
  }

  async jumpToUrl(code: string, req: Request & IProtectedGuard, res: Response) {
    const founUrl = await this.urlModel.findOne({
      shortCode: code,
    });

    if (!founUrl) {
      throw new NotFoundException('Url Not Found');
    }

    const now = new Date();
    if (founUrl.expiresAt && now > founUrl.expiresAt) {
      throw new NotFoundException('This short URL has expired');
    }

    await this.urlModel.findByIdAndUpdate(founUrl._id, {
      $inc: { viewersCount: 1 },
    });

    return res.redirect(founUrl.orginalUrl);
  }

  async deleteUrl(urlId: string) {
    if (!Types.ObjectId.isValid(urlId)) {
      throw new BadRequestException('Invalid Url Id format');
    }

    const foundUrl = await this.urlModel.findByIdAndDelete(urlId);

    if (!foundUrl) {
      throw new NotFoundException('Url Not Found!');
    }

    return {
      message: 'success',
    };
  }
}
