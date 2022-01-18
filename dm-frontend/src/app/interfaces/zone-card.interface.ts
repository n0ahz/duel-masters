import { CardInterface } from "./card.interface";

export interface ZoneCardInterface {
  card: CardInterface;
  uid?: string;
  isTapped?: boolean;
  ownerId?: string;
}
