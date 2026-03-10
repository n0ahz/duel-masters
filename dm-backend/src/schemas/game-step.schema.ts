import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type GameStepDocument = HydratedDocument<GameStep>;

@Schema()
export class GameStep {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Game', required: true, index: true })
  game: Types.ObjectId;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  actor: string;

  @Prop({ required: true })
  event: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  payload: object;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const GameStepSchema = SchemaFactory.createForClass(GameStep);
