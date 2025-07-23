import { Module } from '@nestjs/common';
import { ShortUrlController } from './shortUrl.controller';
import { ShortUrlService } from './shortUrl.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './models';
import { User, UserSchema } from '../auth';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ShortUrlController],
  providers: [ShortUrlService],
})
export class ShortUrlModule {}
