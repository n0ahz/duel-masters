import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CardDocument = HydratedDocument<Card>;

@Schema()
class Printing {
  @Prop({ required: true })
  set: string;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  rarity: string;

  @Prop({ required: true })
  illustrator: string;

  @Prop()
  flavor?: string;
}

@Schema()
export class Card {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ type: [String] })
  civilizations: string[];

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  cost: number;

  @Prop()
  power?: string;

  @Prop()
  text?: string;

  @Prop({ type: [String] })
  subtypes?: string[];

  @Prop({ type: [String] })
  supertypes?: string[];

  @Prop({ type: [Object] })
  printings: Printing[];
}

export const CardSchema = SchemaFactory.createForClass(Card);
