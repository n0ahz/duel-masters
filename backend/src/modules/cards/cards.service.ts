import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from './schemas/card.schema';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
  ) {}

  async findAll(
    filters: { civilization?: string; type?: string; set?: string; search?: string } = {},
  ): Promise<Card[]> {
    const query: any = {};
    if (filters.civilization) query.civilizations = filters.civilization;
    if (filters.type) query.type = filters.type;
    if (filters.set) query['printings.set'] = filters.set;
    if (filters.search)
      query.name = { $regex: filters.search, $options: 'i' };
    return this.cardModel.find(query).limit(200).exec();
  }

  async findById(id: string): Promise<Card> {
    return this.cardModel.findById(id).exec();
  }

  async findByCivilization(civilization: string): Promise<Card[]> {
    return this.cardModel.find({ civilizations: civilization }).exec();
  }
}
