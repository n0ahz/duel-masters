import {CardInterface} from "./card.interface";

export interface CreatureCardInterface extends CardInterface {
  race: string;
  power: number;
  powerExtensible?: boolean;
}
