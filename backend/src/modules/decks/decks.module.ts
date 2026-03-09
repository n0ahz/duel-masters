import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Deck, DeckSchema } from './schemas/deck.schema';
import { Card, CardSchema } from '../cards/schemas/card.schema';
import { DecksService } from './decks.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Deck.name, schema: DeckSchema },
      { name: Card.name, schema: CardSchema },
    ]),
  ],
  providers: [DecksService],
  exports: [DecksService],
})
export class DecksModule {}
