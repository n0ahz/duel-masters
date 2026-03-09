import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({ collection: 'cards' })
export class Card {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  civilizations: string[];

  @Prop({ required: true })
  cost: number;

  @Prop()
  power: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: [String], default: [] })
  subtypes: string[];

  @Prop({ type: [String], default: [] })
  supertypes: string[];

  @Prop()
  text: string;

  @Prop({ type: [Object], required: true })
  printings: Array<{
    set: string;
    id: string;
    rarity: string;
    illustrator?: string;
    flavor?: string;
  }>;
}

export const CardSchema = SchemaFactory.createForClass(Card);
CardSchema.index({ name: 1 });
CardSchema.index({ civilizations: 1 });
CardSchema.index({ type: 1 });
