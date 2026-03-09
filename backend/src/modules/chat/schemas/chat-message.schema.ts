import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ collection: 'chat_messages', timestamps: true })
export class ChatMessage {
  @Prop({ type: Types.ObjectId, ref: 'Game', required: true })
  gameId: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
ChatMessageSchema.index({ gameId: 1, timestamp: 1 });
