import {
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request,
} from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  create(@Body() dto: CreateDeckDto, @Request() req: any) {
    return this.decksService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.decksService.findByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.decksService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateDeckDto, @Request() req: any) {
    return this.decksService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.decksService.remove(id, req.user.sub, req.user.isAdmin);
  }
}
