import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../schemas/game.schema';
import { GameStep, GameStepSchema } from '../schemas/game-step.schema';
import { GamesHistoryService } from './games-history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: GameStep.name, schema: GameStepSchema },
    ]),
  ],
  providers: [GamesHistoryService],
  exports: [GamesHistoryService],
})
export class GamesHistoryModule {}
