import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SetDocument = HydratedDocument<CardSet>;

@Schema({ collection: 'sets' })
export class CardSet {
  @Prop({ required: true, unique: true, index: true })
  setCode: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  era: string; // 'shobu' | 'katta' | 'joe'

  @Prop()
  block?: string;

  @Prop({ default: 0 })
  totalCards: number;

  @Prop()
  imageUrl?: string;

  @Prop()
  releaseYear?: number;
}

export const CardSetSchema = SchemaFactory.createForClass(CardSet);
