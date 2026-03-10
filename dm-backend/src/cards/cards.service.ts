import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from '../schemas/card.schema';

@Injectable()
export class CardsService {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  findAll(query?: { name?: string; civilization?: string; type?: string; set?: string }) {
    const filter: any = {};
    if (query?.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }
    if (query?.civilization) {
      filter.civilizations = query.civilization;
    }
    if (query?.type) {
      filter.type = query.type;
    }
    if (query?.set) {
      filter['printings.set'] = { $regex: `^${query.set}\\b`, $options: 'i' };
    }
    return this.cardModel.find(filter).exec();
  }

  findById(id: string) {
    return this.cardModel.findById(id).exec();
  }
}
