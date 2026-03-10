import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class DeckCardDto {
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsNumber()
  @Min(1)
  @Max(4)
  count: number;
}

export class CreateDeckDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeckCardDto)
  cards: DeckCardDto[];
}
