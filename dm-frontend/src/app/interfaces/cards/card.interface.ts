import {CivilizationsEnum} from "../../enums/civilizations.enum";
import {RaritiesEnum} from "../../enums/rarities.enum";
import {SetsEnum} from "../../enums/sets.enum";

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
}
