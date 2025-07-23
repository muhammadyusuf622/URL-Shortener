import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, SchemaTypes, Types } from 'mongoose';

export type UrlDocument = Url & Document;

@Schema({ collection: 'shortUrl', timestamps: true, versionKey: false })
export class Url {
  @Prop({ type: SchemaTypes.String, required: true })
  orginalUrl: string;

  @Prop({ type: SchemaTypes.String, required: true })
  shortCode: string;

  @Prop({ type: SchemaTypes.Number, required: false, default: 0 })
  viewersCount: number;

  @Prop({
    type: SchemaTypes.Date,
    required: true,
    default: () => {
      const dates = {
        '2m': 2 * 60 * 1000,
        '10m': 10 * 60 * 1000,
        '1h': 1 * 60 * 60 * 1000,
        '2h': 2 * 60 * 60 * 1000,
        '1d': 24 * 60 * 60 * 1000,
        '1w': 7 * 24 * 60 * 60 * 1000,
      };

      const selected = process.env.EXPIRATION || '1h';
      const duration = dates[selected] || dates['1h'];
      return new Date(Date.now() + duration);
    },
  })
  expiresAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;


  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
