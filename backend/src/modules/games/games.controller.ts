import { Controller, Get, Param, Query } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findByUser(@Query('userId') userId: string) {
    return this.gamesService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findById(id);
  }

  @Get(':id/steps')
  findSteps(@Param('id') id: string) {
    return this.gamesService.findSteps(id);
  }
}
