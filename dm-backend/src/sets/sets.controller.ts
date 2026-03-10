import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { SetsService } from './sets.service';

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Get()
  findAll() {
    return this.setsService.findAll();
  }

  @Get(':setCode')
  async findOne(@Param('setCode') setCode: string) {
    const set = await this.setsService.findByCode(setCode);
    if (!set) throw new NotFoundException(`Set ${setCode} not found`);
    return set;
  }
}
