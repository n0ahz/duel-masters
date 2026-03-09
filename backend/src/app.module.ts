import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsModule } from './modules/cards/cards.module';
import { UsersModule } from './modules/users/users.module';
import { GamesModule } from './modules/games/games.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { DecksModule } from './modules/decks/decks.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/duel-masters',
    ),
    CardsModule,
    UsersModule,
    GamesModule,
    AuthModule,
    ChatModule,
    DecksModule,
    GatewayModule,
  ],
})
export class AppModule {}
