import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeckDocument = Deck & Document;

@Schema({ collection: 'decks', timestamps: true })
export class Deck {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: [{ cardId: String, copies: Number }],
    default: [],
  })
  cards: { cardId: string; copies: number }[];
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
DeckSchema.index({ userId: 1 });
