import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainGateway } from './gateway/main.gateway';
import { GamesGateway } from './gateway/games.gateway';
import { DuelDecisionGateway } from './gateway/duel-decision.gateway';
import { DuelGateway } from './gateway/duel.gateway';
import { GameRoomService } from './services/game-room.service';
import { DuelStateService } from './services/duel-state.service';
import { CoinTossService } from './services/coin-toss.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { DecksModule } from './decks/decks.module';
import { GamesHistoryModule } from './games-history/games-history.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/duel-masters'),
    AuthModule,
    UsersModule,
    CardsModule,
    DecksModule,
    GamesHistoryModule,
  ],
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
