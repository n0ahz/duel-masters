import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from '../schemas/game.schema';
import { GameStep, GameStepDocument } from '../schemas/game-step.schema';
import { GameInterface } from '../interfaces/game.interface';
import { GameStatusEnum } from '../enums/games.enum';

@Injectable()
export class GamesHistoryService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(GameStep.name) private gameStepModel: Model<GameStepDocument>,
  ) {}

  createGame(game: GameInterface) {
    return this.gameModel.create({
      gameIdentifier: game.gameIdentifier,
      name: game.name,
      inviter: game.inviter,
      challenger: game.challenger,
      gameType: game.gameType,
      status: game.status ?? GameStatusEnum.PENDING,
      firstToGo: game.firstToGo,
      createdAt: game.createdAt ? new Date(game.createdAt) : new Date(),
    });
  }

  updateGame(gameIdentifier: string, patch: Partial<GameInterface & { endedAt: Date }>) {
    return this.gameModel.findOneAndUpdate({ gameIdentifier }, patch, { new: true }).exec();
  }

  async addStep(gameIdentifier: string, type: string, actor: string, event: string, payload: any) {
    const game = await this.gameModel.findOne({ gameIdentifier }).exec();
    if (!game) return;
    return this.gameStepModel.create({ game: game._id, type, actor, event, payload });
  }

  async getGameHistory(gameIdentifier: string) {
    const game = await this.gameModel.findOne({ gameIdentifier }).exec();
    if (!game) return null;
    const steps = await this.gameStepModel.find({ game: game._id }).sort({ timestamp: 1 }).exec();
    return { game, steps };
  }
}
