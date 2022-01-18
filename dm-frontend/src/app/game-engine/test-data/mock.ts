import {Player} from "../player";
import {Deck} from "../deck";
import * as cards from "../test-data/cards";
import { Duelist } from "../duelist";

export class Mock {

  inviter: Duelist;
  challenger: Duelist;

  constructor() {
    const times = 4;

    const player = new Player({name: 'inviter'});
    player.primaryDeck = new Deck({name: 'Inviter Deck'});
    for (let i=0; i<times; i++){
      player.primaryDeck.addCard(cards.reusol());
      player.primaryDeck.addCard(cards.senatineJadeTree());
      player.primaryDeck.addCard(cards.diaNork());
      player.primaryDeck.addCard(cards.szubsKin());
      player.primaryDeck.addCard(cards.laUraGiga());
    }
    this.inviter = new Duelist(player);

    const challenger = new Player({name: 'challenger'});
    challenger.primaryDeck = new Deck({name: 'Challenger Deck'});
    for (let i=0; i<times; i++){
      challenger.primaryDeck.addCard(cards.brawlerZyler());
      challenger.primaryDeck.addCard(cards.immortalBaronVorg());
      challenger.primaryDeck.addCard(cards.bolshack());
    }
    this.challenger = new Duelist(challenger);
  }
}
