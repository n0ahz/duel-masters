import { PlayerInterface } from '../interfaces/player.interface';
import { Deck } from './deck';


export class Player implements PlayerInterface {

  name: string;
  avatar?: string;
  preferredCivilization?: string;
  decks?: Deck[];
  primaryDeck?: Deck;

  constructor(playerDto: PlayerInterface) {
    this.name = playerDto.name;
    this.avatar = playerDto.avatar;
    this.preferredCivilization = playerDto.preferredCivilization;
    // ToDo: prepare deck using DeckInterface and Deck class..
    this.decks = [];
  }

  addDeck(deck: Deck) {
    this.decks.push(deck);
  }

  removeDeck(deck: Deck) {
    this.decks = this.decks.filter(d => d === deck);
  }

  setPrimaryDeck(deck: Deck) {
    this.primaryDeck = deck;
  }

  shuffleDeck() {
    this.primaryDeck.shuffle();
  }
}
