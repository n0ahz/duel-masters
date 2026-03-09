import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Game, GameDocument } from './schemas/game.schema';
import { GameStep, GameStepDocument } from './schemas/game-step.schema';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(GameStep.name) private gameStepModel: Model<GameStepDocument>,
  ) {}

  async createGame(data: {
    name: string;
    inviterId: string;
    inviterName: string;
    type?: string;
  }): Promise<GameDocument> {
    return this.gameModel.create({ ...data, status: 'waiting' });
  }

  async startGame(gameId: string): Promise<GameDocument> {
    return this.gameModel
      .findByIdAndUpdate(
        gameId,
        { status: 'in-progress', startedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async endGame(gameId: string, winnerId: string): Promise<GameDocument> {
    return this.gameModel
      .findByIdAndUpdate(
        gameId,
        { status: 'completed', endedAt: new Date(), winnerId },
        { new: true },
      )
      .exec();
  }

  async updateStatus(
    gameId: string,
    status: string,
    extra: Record<string, any> = {},
  ): Promise<GameDocument> {
    return this.gameModel
      .findByIdAndUpdate(gameId, { status, ...extra }, { new: true })
      .exec();
  }

  async recordStep(
    gameId: string,
    step: { playerId: string; type: string; payload?: any },
  ): Promise<GameStepDocument> {
    const count = await this.gameStepModel.countDocuments({
      gameId: new Types.ObjectId(gameId),
    });
    return this.gameStepModel.create({
      gameId: new Types.ObjectId(gameId),
      ...step,
      sequenceNumber: count + 1,
      timestamp: new Date(),
    });
  }

  async findByUser(userId: string): Promise<GameDocument[]> {
    return this.gameModel
      .find({ $or: [{ inviterId: userId }, { challengerId: userId }] })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(gameId: string): Promise<GameDocument> {
    return this.gameModel.findById(gameId).exec();
  }

  async findSteps(gameId: string): Promise<GameStepDocument[]> {
    return this.gameStepModel
      .find({ gameId: new Types.ObjectId(gameId) })
      .sort({ sequenceNumber: 1 })
      .exec();
  }
}
