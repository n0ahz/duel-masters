import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainGateway } from './gateway/main.gateway';
import { GamesGateway } from './gateway/games.gateway';
import { DuelDecisionGateway } from './gateway/duel-decision.gateway';
import { DuelGateway } from './gateway/duel.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    MainGateway,
    GamesGateway,
    DuelDecisionGateway,
    DuelGateway,
  ],
})
export class AppModule {}
