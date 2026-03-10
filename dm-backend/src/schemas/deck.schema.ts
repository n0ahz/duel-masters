import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type DeckDocument = HydratedDocument<Deck>;

@Schema()
class DeckCard {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Card', required: true })
  card: Types.ObjectId;

  @Prop({ required: true })
  count: number;
}

@Schema({ timestamps: true })
export class Deck {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [Object] })
  cards: DeckCard[];

  createdAt: Date;
  updatedAt: Date;
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
