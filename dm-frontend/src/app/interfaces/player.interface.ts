import { DeckInterface } from './deck.interface';

export interface PlayerInterface {
  name: string;
  avatar?: string;
  preferredCivilization?: string;
  decks?: DeckInterface[];
  primaryDeck?: DeckInterface;
}
