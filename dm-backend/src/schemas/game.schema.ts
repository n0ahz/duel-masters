import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game {
  @Prop({ required: true, unique: true, index: true })
  gameIdentifier: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  inviter: string;

  @Prop()
  challenger?: string;

  @Prop()
  gameType?: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  firstToGo?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  endedAt?: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
