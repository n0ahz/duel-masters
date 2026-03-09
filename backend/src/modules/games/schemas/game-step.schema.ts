import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GameStepDocument = GameStep & Document;

@Schema({ collection: 'game_steps', timestamps: true })
export class GameStep {
  @Prop({ type: Types.ObjectId, ref: 'Game', required: true })
  gameId: Types.ObjectId;

  @Prop({ required: true })
  playerId: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: Object })
  payload: Record<string, any>;

  @Prop({ required: true })
  sequenceNumber: number;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const GameStepSchema = SchemaFactory.createForClass(GameStep);
GameStepSchema.index({ gameId: 1, sequenceNumber: 1 });
