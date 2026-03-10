import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainGateway } from './gateway/main.gateway';
import { GamesGateway } from './gateway/games.gateway';
import { DuelDecisionGateway } from './gateway/duel-decision.gateway';
import { DuelGateway } from './gateway/duel.gateway';
import { GameRoomService } from './services/game-room.service';
import { DuelStateService } from './services/duel-state.service';
import { CoinTossService } from './services/coin-toss.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    GameRoomService,
    DuelStateService,
    CoinTossService,
    MainGateway,
    GamesGateway,
    DuelDecisionGateway,
    DuelGateway,
  ],
})
export class AppModule {}
