import { Player } from "./player";
import { PlayerSidesEnum } from "../enums/player-sides.enum";
import { DuelScene } from "./scenes/duel.scene";
import { CommonEventsEnum } from "../enums/gateway/common-events.enum";
import { RolesEnum } from "../enums/roles.enum";
import { ZonesEnum } from "../enums/zones.enum";
import { ZoneCard } from "./zone-card";
import { PositionsEnum } from "../enums/positions.enum";
import { LifeGauge } from "./life-gauge";
import { GAME } from "../constants/game";

export class Duelist {

  player: Player;
  socketId: string;
  order?: number;
  side: PlayerSidesEnum;
  duelDeck: ZoneCard[];
  lifeGauge: LifeGauge;

  constructor(player: Player) {
    this.player = player;
  }

  prepareDuelDeck(){
    this.player.shuffleDeck();
    this.duelDeck = this.player.primaryDeck.cards.map(card => new ZoneCard({card: card, ownerId: this.socketId})); // ToDo: change from name to id or something
  }

  startGame(scene: DuelScene){
    this.lifeGauge = new LifeGauge(scene, this.side);

    const deckZone = scene.duelZones.get(`${this.player.name}-${ZonesEnum.DECK}`);
    const shieldZone = scene.duelZones.get(`${this.player.name}-${ZonesEnum.SHIELD}`);
    const manaZone = scene.duelZones.get(`${this.player.name}-${ZonesEnum.MANA}`);
    const handZone = scene.duelZones.get(`${this.player.name}-${ZonesEnum.HAND}`);

    deckZone.canDrawCards = true;
    manaZone.canPutCards = true;
    shieldZone.canDrawCards = true;
    shieldZone.canPutCards = true;
    handZone.canDrawCards = true;
    handZone.canPutCards = true;

    deckZone.putCards(this.duelDeck);
    setTimeout(() => {
      if (scene.role !== RolesEnum.VIEWER && this.side === PlayerSidesEnum.BOTTOM) {
        let msg = '';
        if (scene.gameService.game.inviter == scene.socketService.getCurrentSocketId()) {
          msg = 'Inviter: Activate Shields..!';
        } else if (scene.gameService.game.challenger == scene.socketService.getCurrentSocketId()) {
          msg = 'Challenger: Bring it on...!';
        }
        if (msg) {
          scene.socketService.emitTo(scene.gameService.game.gameIdentifier, CommonEventsEnum.MSG_TO_SERVER, {msg: msg});
        }
      }

      for (let i=0; i<5; i++){
        setTimeout(() => {
          deckZone.transferCards(deckZone.takeCards(1, PositionsEnum.BOTTOM), shieldZone);
        }, 100*i);
      }

      setTimeout(() => {
        for (let i=0; i<5; i++){
          setTimeout(() => {
            deckZone.transferCards(deckZone.takeCards(1, PositionsEnum.BOTTOM), handZone);
          }, 100*i);
        }

      }, 2000);

    }, 3000);
  }
}
