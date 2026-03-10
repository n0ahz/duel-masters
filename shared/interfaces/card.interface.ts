import { CivilizationsEnum, RaritiesEnum, RacesEnum, SetsEnum } from '../enums/card.enum';

export interface CardInterface {
  name: string;
  _civilization: CivilizationsEnum;
  _type: string;
  cost: number;
  _rarity?: RaritiesEnum;
  image?: string;
  manaNumber?: number;
  cardText?: string;
  illustrator?: string;
  flavorText?: string;
  _set?: SetsEnum;
  cardSerial?: number;
  collectorNo?: string;
  uid?: string;
  // Creature-specific
  race?: RacesEnum;
  power?: number;
  powerExtensible?: boolean;
}
