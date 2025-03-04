import { DeckInterface } from '../interfaces/deck.interface';
import { Card } from './card';
import { DECK } from 'src/app/constants/game';
import * as _ from 'lodash';


export class Deck implements DeckInterface {

  name: string;
  theme?: string;
  preBuilt?: boolean;
  cards?: Card[];

  constructor(deckDto: DeckInterface) {
    this.name = deckDto.name;
    this.theme = deckDto.theme;
    this.preBuilt = deckDto.preBuilt;
    this.cards = [];
  }

  get noOfCards(): number {
    return this.cards.length;
  }

  addCard(card: Card, times?: number) {
    if (this.cards.length >= DECK.MAX_CARDS_PER_DECK) {
      throw 'Deck is full!';
    }
    if (this.cards.filter(eachCard => eachCard === card).length >= 4) {
      throw 'Can\'t add same card more than 4 times in a deck!';
    }
    if (times === undefined) times = 1;
    if (times > 4) times = 4;
    for (let i = 0; i < times; i++) {
      this.cards.push(card);
    }
  }

  removeCard(card: Card, all?: boolean) {
    if (all === undefined) all = false;
    const cardIndexFound = this.cards.indexOf(card);
    if (cardIndexFound !== -1) {
      if (all) {
        this.cards = this.cards.filter(eachCard => eachCard !== card);
      } else {
        this.cards.splice(cardIndexFound, 1);
      }
    }
  }

  empty() {
    this.cards = [];
  }

  shuffle() {
    this.cards = _.shuffle(this.cards);
  }

}
