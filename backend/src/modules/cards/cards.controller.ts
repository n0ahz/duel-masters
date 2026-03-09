import { Controller, Get, Param, Query } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  findAll(
    @Query('civilization') civilization?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    return this.cardsService.findAll({ civilization, type, search });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.findById(id);
  }
}
