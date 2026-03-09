import { Module } from '@nestjs/common';
import { MainGateway } from './main.gateway';
import { GamesGateway } from './games.gateway';
import { DuelGateway } from './duel.gateway';
import { DuelDecisionGateway } from './duel-decision.gateway';
import { ChatGateway } from './chat.gateway';
import { DecksGateway } from './decks.gateway';
import { GameRoomService } from '../services/game-room.service';
import { CoinTossService } from '../services/coin-toss.service';
import { DuelStateService } from '../services/duel-state.service';
import { GamesModule } from '../modules/games/games.module';
import { ChatModule } from '../modules/chat/chat.module';
import { DecksModule } from '../modules/decks/decks.module';

@Module({
  imports: [GamesModule, ChatModule, DecksModule],
  providers: [
    MainGateway,
    GamesGateway,
    DuelGateway,
    DuelDecisionGateway,
    ChatGateway,
    DecksGateway,
    GameRoomService,
    CoinTossService,
    DuelStateService,
  ],
})
export class GatewayModule {}
