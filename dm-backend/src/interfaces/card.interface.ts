export interface CardInterface {
  name: string;
  _civilization: string;
  _type: string;
  cost: number;
  _rarity?: string;
  image?: string;
  manaNumber?: number;
  cardText?: string;
  illustrator?: string;
  flavorText?: string;
  _set?: string;
  cardSerial?: number;
  collectorNo?: string;
  uid?: string;
  // other attributes that are specific to types
  // for Creature
  race?: string;
  power?: number;
  powerExtensible?: boolean;
}
