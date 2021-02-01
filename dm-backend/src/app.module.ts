import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DuelGateway } from './gateway/duel.gateway';

@Module({
  imports: [],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    DuelGateway,
  ],
})
export class AppModule {}
