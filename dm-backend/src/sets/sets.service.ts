import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CardSet, SetDocument } from '../schemas/set.schema';

@Injectable()
export class SetsService {
  constructor(@InjectModel(CardSet.name) private setModel: Model<SetDocument>) {}

  findAll(): Promise<CardSet[]> {
    return this.setModel.find().sort({ setCode: 1 }).exec();
  }

  findByCode(setCode: string): Promise<CardSet | null> {
    return this.setModel.findOne({ setCode }).exec();
  }
}
