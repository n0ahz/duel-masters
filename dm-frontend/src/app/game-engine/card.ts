import { CardInterface } from "../interfaces/card.interface";
import { CivilizationInterface } from "../interfaces/civilization.interface";
import { CardTypesEnum } from "../enums/card-types.enum";
import { RarityInterface } from "../interfaces/rarity.interface";
import { CivilizationsEnum } from "../enums/civilizations.enum";
import { CivilizationFactory } from "./factories/civilization.factory";
import { RaritiesEnum } from "../enums/rarities.enum";
import { RarityFactory } from "./factories/rarity.factory";
import { SetsEnum } from "../enums/sets.enum";
import { SetInterface } from "../interfaces/set.interface";
import { SetFactory } from "./factories/set.factory";
import { RacesEnum } from "../enums/races.enum";


export class Card implements CardInterface {
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
  // other attributes that are specific to types
  // for Creature
  race?: RacesEnum;
  power?: number;
  powerExtensible?: boolean;


  constructor(cardDto: CardInterface) {
    this.name = cardDto.name;
    this._civilization = cardDto._civilization;
    this._type = cardDto._type;
    this.cost = cardDto.cost;
    this._rarity = cardDto._rarity;
    this.image = cardDto.image;
    this.manaNumber = cardDto.manaNumber ? cardDto.manaNumber : 1;
    this.cardText = cardDto.cardText;
    this.illustrator = cardDto.illustrator;
    this.flavorText = cardDto.flavorText;
    this._set = cardDto._set;
    this.cardSerial = cardDto.cardSerial;
    this.collectorNo = cardDto.collectorNo;
    this.uid = cardDto.uid;
    this.race = cardDto.race;
    this.power = cardDto.power;
    this.powerExtensible = cardDto.powerExtensible;
  }

  get civilization(): CivilizationInterface {
    return CivilizationFactory.getInstance(this._civilization);
  }

  get type(): CardTypesEnum {
    return CardTypesEnum[this._type];
  }

  get rarity(): RarityInterface {
    return RarityFactory.getInstance(this._rarity);
  }

  get set(): SetInterface {
    return SetFactory.getInstance(this._set);
  }


}
