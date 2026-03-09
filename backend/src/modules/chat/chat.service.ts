import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ChatMessage,
  ChatMessageDocument,
} from './schemas/chat-message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessageDocument>,
  ) {}

  async saveMessage(data: {
    gameId: string;
    userId: string;
    username: string;
    message: string;
  }): Promise<ChatMessageDocument> {
    return this.chatMessageModel.create({
      ...data,
      gameId: new Types.ObjectId(data.gameId),
      timestamp: new Date(),
    });
  }

  async findByGame(gameId: string): Promise<ChatMessageDocument[]> {
    return this.chatMessageModel
      .find({ gameId: new Types.ObjectId(gameId) })
      .sort({ timestamp: 1 })
      .exec();
  }
}
