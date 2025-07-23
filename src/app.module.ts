import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule, ShortUrlModule } from './modules';
import { APP_GUARD } from '@nestjs/core';
import { CheckAuthGuard, CheckRolesGuard } from './guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.DB_URL as string),
    AuthModule,
    ShortUrlModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: CheckAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: CheckRolesGuard
    }
  ]
})
export class AppModule {}
