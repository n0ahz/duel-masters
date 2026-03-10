import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardSet, CardSetSchema } from '../schemas/set.schema';
import { SetsService } from './sets.service';
import { SetsController } from './sets.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: CardSet.name, schema: CardSetSchema }])],
  controllers: [SetsController],
  providers: [SetsService],
  exports: [SetsService],
})
export class SetsModule {}
