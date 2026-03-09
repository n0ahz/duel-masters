import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck, DeckDocument } from './schemas/deck.schema';
import { Card, CardDocument } from '../cards/schemas/card.schema';
import { CardInterface, GAME_CONSTANTS } from '@dm/shared';

@Injectable()
export class DecksService {
  constructor(
    @InjectModel(Deck.name) private deckModel: Model<DeckDocument>,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
  ) {}

  async createDeck(
    userId: string,
    name: string,
    cards: { cardId: string; copies: number }[],
  ): Promise<DeckDocument> {
    const totalCopies = cards.reduce((sum, c) => sum + c.copies, 0);
    if (totalCopies > GAME_CONSTANTS.DECK_MAX) {
      throw new BadRequestException(
        `Deck cannot exceed ${GAME_CONSTANTS.DECK_MAX} cards`,
      );
    }
    for (const entry of cards) {
      if (entry.copies > 4) {
        throw new BadRequestException(
          `Card ${entry.cardId} exceeds max 4 copies`,
        );
      }
    }
    return this.deckModel.create({ userId, name, cards });
  }

  async getUserDecks(userId: string): Promise<DeckDocument[]> {
    return this.deckModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async getDeck(deckId: string): Promise<DeckDocument> {
    const deck = await this.deckModel.findById(deckId).exec();
    if (!deck) throw new NotFoundException('Deck not found');
    return deck;
  }

  async updateDeck(
    deckId: string,
    userId: string,
    name: string,
    cards: { cardId: string; copies: number }[],
  ): Promise<DeckDocument> {
    const deck = await this.getDeck(deckId);
    if (deck.userId !== userId) {
      throw new BadRequestException('Not your deck');
    }
    const totalCopies = cards.reduce((sum, c) => sum + c.copies, 0);
    if (totalCopies > GAME_CONSTANTS.DECK_MAX) {
      throw new BadRequestException(
        `Deck cannot exceed ${GAME_CONSTANTS.DECK_MAX} cards`,
      );
    }
    for (const entry of cards) {
      if (entry.copies > 4) {
        throw new BadRequestException(
          `Card ${entry.cardId} exceeds max 4 copies`,
        );
      }
    }
    deck.name = name;
    deck.cards = cards;
    return deck.save();
  }

  async deleteDeck(deckId: string, userId: string): Promise<void> {
    const deck = await this.getDeck(deckId);
    if (deck.userId !== userId) {
      throw new BadRequestException('Not your deck');
    }
    await this.deckModel.findByIdAndDelete(deckId).exec();
  }

  async expandDeck(deckId: string): Promise<CardInterface[]> {
    const deck = await this.getDeck(deckId);
    const cardIds = deck.cards.map((c) => c.cardId);
    const cardDocs = await this.cardModel
      .find({ _id: { $in: cardIds } })
      .exec();

    const cardMap = new Map<string, CardDocument>();
    for (const doc of cardDocs) {
      cardMap.set((doc as any)._id.toString(), doc);
    }

    const result: CardInterface[] = [];
    for (const entry of deck.cards) {
      const card = cardMap.get(entry.cardId);
      if (!card) continue;
      for (let i = 0; i < entry.copies; i++) {
        result.push({
          _id: (card as any)._id.toString(),
          name: card.name,
          civilizations: card.civilizations,
          cost: card.cost,
          power: card.power,
          type: card.type,
          subtypes: card.subtypes,
          supertypes: card.supertypes,
          text: card.text,
          printings: card.printings,
        });
      }
    }
    return result;
  }
}
