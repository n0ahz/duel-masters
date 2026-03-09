import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({ collection: 'games', timestamps: true })
export class Game {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  inviterId: string;

  @Prop()
  inviterName: string;

  @Prop()
  challengerId: string;

  @Prop()
  challengerName: string;

  @Prop({ default: 'waiting' })
  status: string;

  @Prop({ default: 'standard' })
  type: string;

  @Prop()
  startedAt: Date;

  @Prop()
  endedAt: Date;

  @Prop()
  winnerId: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
