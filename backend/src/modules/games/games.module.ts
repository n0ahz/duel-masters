import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './schemas/game.schema';
import { GameStep, GameStepSchema } from './schemas/game-step.schema';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: GameStep.name, schema: GameStepSchema },
    ]),
  ],
  providers: [GamesService],
  controllers: [GamesController],
  exports: [GamesService],
})
export class GamesModule {}
