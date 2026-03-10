import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Deck, DeckDocument } from '../schemas/deck.schema';
import { CardsService } from '../cards/cards.service';
import { CreateDeckDto } from './dto/create-deck.dto';

const MAX_CARDS_PER_DECK = 40;
const MAX_COPIES_PER_CARD = 4;

@Injectable()
export class DecksService {
  constructor(
    @InjectModel(Deck.name) private deckModel: Model<DeckDocument>,
    private readonly cardsService: CardsService,
  ) {}

  private async validateAndBuildCards(cards: { cardId: string; count: number }[]) {
    const total = cards.reduce((sum, c) => sum + c.count, 0);
    if (total > MAX_CARDS_PER_DECK) {
      throw new BadRequestException(`Deck cannot exceed ${MAX_CARDS_PER_DECK} cards`);
    }
    const built = [];
    for (const item of cards) {
      if (item.count > MAX_COPIES_PER_CARD) {
        throw new BadRequestException(`Cannot have more than ${MAX_COPIES_PER_CARD} copies of a card`);
      }
      const card = await this.cardsService.findById(item.cardId);
      if (!card) {
        throw new NotFoundException(`Card ${item.cardId} not found`);
      }
      built.push({ card: new Types.ObjectId(item.cardId), count: item.count });
    }
    return built;
  }

  async create(userId: string, dto: CreateDeckDto) {
    const cards = await this.validateAndBuildCards(dto.cards);
    return this.deckModel.create({ owner: new Types.ObjectId(userId), name: dto.name, cards });
  }

  findByUser(userId: string) {
    return this.deckModel.find({ owner: new Types.ObjectId(userId) }).populate('cards.card').exec();
  }

  findById(id: string) {
    return this.deckModel.findById(id).populate('cards.card').exec();
  }

  async update(id: string, userId: string, dto: CreateDeckDto) {
    const deck = await this.deckModel.findById(id).exec();
    if (!deck) throw new NotFoundException('Deck not found');
    if (deck.owner.toString() !== userId) throw new ForbiddenException();
    const cards = await this.validateAndBuildCards(dto.cards);
    return this.deckModel.findByIdAndUpdate(id, { name: dto.name, cards }, { new: true }).exec();
  }

  async remove(id: string, userId: string, isAdmin = false) {
    const deck = await this.deckModel.findById(id).exec();
    if (!deck) throw new NotFoundException('Deck not found');
    if (!isAdmin && deck.owner.toString() !== userId) throw new ForbiddenException();
    return this.deckModel.findByIdAndDelete(id).exec();
  }
}
