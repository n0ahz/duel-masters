import * as Phaser from "phaser";
import { Mock } from "../test-data/mock";
import { CARD, GAME } from "../../constants/game";
import { DuelService } from "../../services/duel.service";
import { SocketService } from "../../services/socket.service";
import { DuelEventsEnum } from "../../enums/gateway/duel-events.enum";
import { CommonEventsEnum } from "../../enums/gateway/common-events.enum";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { RolesEnum } from "../../enums/roles.enum";
import { PlayerSidesEnum } from "../../enums/player-sides.enum";
import { GameService } from "../../services/game.service";
import { Duelist } from "../duelist";
import { ZoneCard } from "../zone-card";
import { PhaserComponents } from "../phaser-components";
import DuelZone from "../duel-zone";
import { ZonesEnum } from "../../enums/zones.enum";
import { ZoneVisibilitiesEnum } from "../../enums/zone-visibilities.enum";
import { ZoneTypesEnum } from "../../enums/zone-types.enum";
import { ZoneSpacingEnum } from "../../enums/zone-spacing.enum";
import * as _ from 'lodash';
import { LifeGauge } from "../life-gauge";


export class DuelScene extends Phaser.Scene {

  gameWorldWidth: number;
  gameWorldHeight: number;
  bg: any;
  gameLogTextArea: any;
  cardDisplayArea: Phaser.GameObjects.Zone;
  gameKeys: any;
  popupMenu: any;
  duelZones: Map<string, DuelZone>;
  duelists: Duelist[];

  role: RolesEnum;

  gameService: GameService;
  duelService: DuelService;
  socketService: SocketService;

  constructor(
  ) {
    super({ key: 'duel' });
    this.duelZones = new Map();
    this.duelists = [];
  }

  preload() {
    this.load.setBaseURL('');
    this.load.image('bg', 'assets/imgs/bg.jpg');
    this.load.image('cardBack', 'assets/imgs/card-back.png');
    // zone icons
    this.load.image('hand', 'assets/imgs/zones/hand.png');
    this.load.image('mana', 'assets/imgs/zones/mana.png');
    this.load.image('shield', 'assets/imgs/zones/shield.png');
    this.load.image('deck', 'assets/imgs/zones/deck.png');
    this.load.image('grave', 'assets/imgs/zones/grave.png');
    this.load.image('battle', 'assets/imgs/zones/battle.png');
    this.load.image('hs', 'assets/imgs/zones/hs.png');
    // initial avatar icons
    this.load.image('hakuoh', 'assets/imgs/avatars/hakuoh.png');
    this.load.image('kokujo', 'assets/imgs/avatars/kokujo.png');

    this.load.scenePlugin({
      key: 'rexUI',
      url: UIPlugin,
      sceneKey: 'rexUI',
    });
  }

  create(data) {
    this.socketService = data.socketService;
    this.gameService = data.gameService;
    this.duelService = data.duelService;

    const self = this;
    this.gameWorldWidth = Number(this.game.config.width);
    this.gameWorldHeight = Number(this.game.config.height);

    this.bg = this.add.image(this.gameWorldWidth/2, this.gameWorldHeight/2, 'bg');
    this.bg.setAlpha(0.5, 0.5, 0.5, 0.5);

    let rexUI = this['rexUI'];
    this.gameLogTextArea = PhaserComponents.getTextArea(
      this,
      this.gameWorldWidth /2 - GAME.STAGE.WIDTH/2 - (this.gameWorldWidth - GAME.STAGE.WIDTH)/4,
      this.gameWorldHeight- GAME.WORLD.GAME_LOG_TEXT_AREA_HEIGHT/2,
      (this.gameWorldWidth - GAME.STAGE.WIDTH)/2 - 10,
      GAME.WORLD.GAME_LOG_TEXT_AREA_HEIGHT,
      ' Duel Logs',
    );
    this.log('Welcome to the Temple.... Duelist!');

    this.cardDisplayArea = this.add.zone((GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/4, 250+5, (this.gameWorldWidth - GAME.STAGE.WIDTH)/2, 500).setRectangleDropZone((this.gameWorldWidth - GAME.STAGE.WIDTH)/2, 500);
    this.cardDisplayArea.setData({'img': null});

    this.gameKeys = this.input.keyboard.addKeys('ESC');

    const mock = new Mock();

    if (this.socketService.getCurrentSocketId() === this.gameService.game.inviter) {
      this.role = RolesEnum.INITIATOR;
      mock.inviter.socketId = this.socketService.getCurrentSocketId();
      mock.inviter.side = PlayerSidesEnum.BOTTOM;
      mock.challenger.side = PlayerSidesEnum.TOP;
    } else if (this.socketService.getCurrentSocketId() === this.gameService.game.challenger) {
      this.role = RolesEnum.CHALLENGER;
      mock.challenger.socketId = this.socketService.getCurrentSocketId();
      mock.inviter.side = PlayerSidesEnum.TOP;
      mock.challenger.side = PlayerSidesEnum.BOTTOM;
    } else {
      this.role = RolesEnum.VIEWER;
      mock.inviter.side = PlayerSidesEnum.BOTTOM;
      mock.challenger.side = PlayerSidesEnum.TOP;
    }

    // inviter => mock.inviter
    // challenger => mock.challenger
    // actual duelist data will be populated here from Player...
    this.duelists.push(this.gameService.game.firstToGo === this.gameService.game.inviter ? mock.inviter : mock.challenger);
    this.duelists.push(this.gameService.game.firstToGo === this.gameService.game.inviter ? mock.challenger : mock.inviter);

    this.renderDuelZones();

    const duelist1 = this.duelists[0];
    const duelist2 = this.duelists[1];
    this.socketService.emitTo(this.gameService.game.gameIdentifier, DuelEventsEnum.SET_UP, {game: this.gameService.game});
    this.socketService.handleEvent(DuelEventsEnum.ALL_SET, (res) => {
      // log( ready player 1 / 2 )..
      if (res.data.allSet === true) {
        // after both player posts ALL_SET then do ikujo koi..
        if (this.gameService.game.firstToGo === this.socketService.getCurrentSocketId()) {
          duelist1.prepareDuelDeck();
          this.socketService.emitTo(this.gameService.game.gameIdentifier, DuelEventsEnum.IKUJO, {duelDeck: duelist1.duelDeck});
        }
      }
    });
    this.socketService.handleEvent(DuelEventsEnum.IKUJO, (res) => {
      this.log(res.data.msg, duelist1.player.name);
      duelist1.duelDeck = res.data.duelDeck.map(zc => new ZoneCard({card: zc.card, uid: zc.uid, ownerId: zc.ownerId}));
      duelist1.startGame(this);

      if (this.gameService.game.firstToGo !== this.socketService.getCurrentSocketId() && [this.gameService.game.inviter, this.gameService.game.challenger].indexOf(this.socketService.getCurrentSocketId()) !== -1) {
        setTimeout(() => {
          duelist2.prepareDuelDeck();
          this.socketService.emitTo(this.gameService.game.gameIdentifier, DuelEventsEnum.KOI, {duelDeck: duelist2.duelDeck});
        }, 1000);
      }
    });
    this.socketService.handleEvent(DuelEventsEnum.KOI, (res) => {
      this.log(res.data.msg, duelist2.player.name);
      duelist2.duelDeck = res.data.duelDeck.map(zc => new ZoneCard({card: zc.card, uid: zc.uid, ownerId: zc.ownerId}));
      duelist2.startGame(this);
    });

    this.socketService.handleEvent(CommonEventsEnum.MSG_TO_CLIENT, (res) => {
      this.log(res.data.msg);
    });

    this.socketService.handleEvent(DuelEventsEnum.DROP_CARDS, (res) => {
      this.setCard(res.data);
    });

    this.socketService.handleEvent(DuelEventsEnum.TAP_UNTAP_CARD, (res) => {
      const zone = this.duelZones.get(res.data.zoneId);
      const card : ZoneCard = _.find(zone.cards, (zc) => zc.uid === res.data.zoneCardId);
      const rotationAngle = card.tapUntapCard();
      this.renderCardTapUntapAnimation(card, rotationAngle);
    });

    new LifeGauge(this, PlayerSidesEnum.BOTTOM);
    new LifeGauge(this, PlayerSidesEnum.TOP);

    this.add.text(GAME.WORLD.WIDTH/2+GAME.STAGE.WIDTH/2 + 25, GAME.STAGE.HEIGHT/3-50, 'Opponent\'s Turn');

    const buttons = PhaserComponents.getButton(this, (GAME.WORLD.WIDTH-(GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/4) + 5, GAME.STAGE.HEIGHT/3, (GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/6, 'Start');
    PhaserComponents.getButton(this, (GAME.WORLD.WIDTH-(GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/4) + 5, GAME.STAGE.HEIGHT/3+50, (GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/6, 'Untap');
    PhaserComponents.getButton(this, (GAME.WORLD.WIDTH-(GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/4) + 5, GAME.STAGE.HEIGHT/3+100, (GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/6, 'Stand By');
    PhaserComponents.getButton(this, (GAME.WORLD.WIDTH-(GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/4) + 5, GAME.STAGE.HEIGHT/3+150, (GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/6, 'Draw');
    PhaserComponents.getButton(this, (GAME.WORLD.WIDTH-(GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/4) + 5, GAME.STAGE.HEIGHT/3+200, (GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/6, 'Charge');
    PhaserComponents.getButton(this, (GAME.WORLD.WIDTH-(GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/4) + 5, GAME.STAGE.HEIGHT/3+250, (GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/6, 'Main');
    PhaserComponents.getButton(this, (GAME.WORLD.WIDTH-(GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/4) + 5, GAME.STAGE.HEIGHT/3+300, (GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/6, 'Battle');
    PhaserComponents.getButton(this, (GAME.WORLD.WIDTH-(GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/4) + 5, GAME.STAGE.HEIGHT/3+350, (GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/6, 'End');

    const element = buttons.getElement('buttons[0].text');

    const flashDuration = 1000 - 500 / 2;
    const easing = 'Linear';

    this.tweens.timeline({
      tweens: [
        {
          targets: element,
          duration: 0,
          alpha: 0,
          ease: easing
        },
        {
          targets: element,
          duration: flashDuration,
          alpha: 1,
          ease: easing
        },
        {
          targets: element,
          duration: 500,
          alpha: 1,
          ease: easing
        },
        {
          targets: element,
          duration: flashDuration,
          alpha: 0,
          ease: easing,
          // onComplete: () => {
          //   if (true) { // repeat
          //     this.flashElement(scene, element);
          //   }
          // }
        }
      ]
    });

    this.input.mouse.disableContextMenu();
  }

  update() {
    // run some functionality for a while based on a boolean that can/should be changed to stop the loop...
    if (this.gameKeys.ESC.isDown) {
      // ToDo: not working...select another key?
      if (this.popupMenu) {
        this.popupMenu.collapse();
        this.popupMenu = undefined;
      }
    }
  }

  log(msg: string, sender?: string) {
    if (msg) {
      msg = `\n>> ${sender ? (sender + ': ' + msg) : msg}`;
      this.gameLogTextArea.appendText(msg);
    }
  }

  renderCardTapUntapAnimation(card: ZoneCard, rotationAngle: number) {
    this.children.bringToTop(card.cardImg);
    this.tweens.add({
      targets: card.cardImg,
      rotation: rotationAngle,
      duration: 250,
    });
  }

  renderCardDisplay(cardImg: Phaser.GameObjects.Image) {
    if (!this.cardDisplayArea.data.values.img) {
      const img = this.add.image(this.cardDisplayArea.x, this.cardDisplayArea.y, cardImg.texture);
      const factor = (this.cardDisplayArea.height / CARD.CONTAINER.HEIGHT) * 0.90;
      img.displayWidth = CARD.CONTAINER.WIDTH * factor;
      img.displayHeight = CARD.CONTAINER.HEIGHT * factor;
      this.cardDisplayArea.data.values.img = img;
    }
  }

  destroyCardDisplay() {
    if (this.cardDisplayArea.data.values.img) {
      this.cardDisplayArea.data.values.img.destroy();
      this.cardDisplayArea.data.values.img = null;
    }
  }

  renderCardInfo(card: ZoneCard) {
    this.duelService.showCardInfoModal(card.card);
  }

  setCard(data){
    this.duelZones.get(data.fromZone).transferCards([new ZoneCard(data.zoneCard)], this.duelZones.get(data.toZone), data.x, data.y);
  }

  renderDuelZones() {
    this.duelists.forEach(duelist => {
      this.renderDuelistZones(duelist);
    });
    this.renderBattleZone();
    this.renderZoneStats();
  }

  renderDuelistZones(duelist: Duelist) {
    const cardWidth = CARD.CONTAINER.WIDTH;
    const cardHeight = CARD.CONTAINER.HEIGHT;
    const gameStageWidth = GAME.STAGE.WIDTH;
    const cardHeightFactor = CARD.FACTOR.HAND;
    let directionFactor = 1;

    let height = cardHeight * cardHeightFactor;

    let startXOrdinate = this.gameWorldWidth/2;
    let xOrdinate = 0;
    let yOrdinate = 0;
    let side = duelist.side;

    if (side === PlayerSidesEnum.BOTTOM) {
      yOrdinate = this.gameWorldHeight - height/2;
    } else {
      yOrdinate = height/2;
      directionFactor = -1;
    }

    const handZone = new DuelZone({name: ZonesEnum.HAND, uid: `${duelist.player.name}-${ZonesEnum.HAND}`, side: side, zoneCardSpacing: ZoneSpacingEnum.EVEN}, this);
    handZone.render(startXOrdinate, yOrdinate, gameStageWidth, height);

    yOrdinate -= directionFactor * height/2;
    height = cardHeight;
    yOrdinate -= directionFactor * height/2;
    const manaZone = new DuelZone({name: ZonesEnum.MANA, uid: `${duelist.player.name}-${ZonesEnum.MANA}`, side: side, visibility: ZoneVisibilitiesEnum.PUBLIC, cardStraight: false, cardsCanTap: true, canSwitchCardSpacing: true}, this);
    manaZone.render(startXOrdinate, yOrdinate, gameStageWidth, height);

    yOrdinate -= directionFactor * height;
    xOrdinate = startXOrdinate + directionFactor * (gameStageWidth/2 - cardWidth/2);
    const hyperSpatialZone = new DuelZone({name: ZonesEnum.HYPERSPATIAL, uid: `${duelist.player.name}-${ZonesEnum.HYPERSPATIAL}`, side: side, visibility: ZoneVisibilitiesEnum.PROTECTED, cardStacked: true}, this);
    hyperSpatialZone.render(xOrdinate, yOrdinate, cardWidth, height);

    xOrdinate -= directionFactor * cardWidth;
    const graveyardZone = new DuelZone({name: ZonesEnum.GRAVEYARD, uid: `${duelist.player.name}-${ZonesEnum.GRAVEYARD}`, side: side, visibility: ZoneVisibilitiesEnum.PUBLIC, cardStacked: true}, this);
    graveyardZone.render(xOrdinate, yOrdinate, cardWidth, height);

    xOrdinate -= directionFactor * cardWidth;
    const deckZone = new DuelZone({name: ZonesEnum.DECK, uid: `${duelist.player.name}-${ZonesEnum.DECK}`, side: side, visibility: ZoneVisibilitiesEnum.OFF, cardStacked: true}, this);
    deckZone.render(xOrdinate, yOrdinate, cardWidth, height);

    xOrdinate -= directionFactor * (cardWidth/2 + (gameStageWidth - cardWidth*3)/2);
    const shieldZone = new DuelZone({name: ZonesEnum.SHIELD, uid: `${duelist.player.name}-${ZonesEnum.SHIELD}`, side: side, visibility: ZoneVisibilitiesEnum.OFF, zoneCardSpacing: ZoneSpacingEnum.EVEN}, this);
    shieldZone.render(xOrdinate, yOrdinate, gameStageWidth - cardWidth*3, height);

    // yOrdinate -= directionFactor* height;
    // const battleZone = new DuelZone({name: ZonesEnum.BATTLE, uid: `${duelist.player.name}-${ZonesEnum.BATTLE}`, side: side, visibility: ZoneVisibilitiesEnum.PUBLIC, type: ZoneTypesEnum.SHARED, cardsCanTap: true}, this);
    // battleZone.render(startXOrdinate, yOrdinate, gameStageWidth, height);

    this.duelZones.set(handZone.uid, handZone);
    this.duelZones.set(manaZone.uid, manaZone);
    this.duelZones.set(hyperSpatialZone.uid, hyperSpatialZone);
    this.duelZones.set(graveyardZone.uid, graveyardZone);
    this.duelZones.set(deckZone.uid, deckZone);
    this.duelZones.set(shieldZone.uid, shieldZone);
  }

  renderBattleZone() {
    let usedHeight = 0;
    this.duelZones.forEach((zone: DuelZone, id: string) => {
      if ([ZonesEnum.HAND, ZonesEnum.MANA, ZonesEnum.SHIELD].indexOf(zone.name) !== -1) {
        usedHeight += zone.dropArea.displayHeight;
      }
    });
    const battleZone = new DuelZone({name: ZonesEnum.BATTLE, uid: `${ZonesEnum.BATTLE}`, visibility: ZoneVisibilitiesEnum.PUBLIC, type: ZoneTypesEnum.SHARED, cardsCanTap: true}, this);
    battleZone.render(this.gameWorldWidth/2, this.gameWorldHeight/2, GAME.STAGE.WIDTH, this.gameWorldHeight-usedHeight);
    this.duelZones.set(battleZone.uid, battleZone);
  }

  renderZoneStats() {
    const p1_items = [
      {name: ''},
      {name: 'Battle', icon: 'battle'},
      {name: ''},
      {name: 'Deck', icon: 'deck'},
      {name: 'Grave', icon: 'grave'},
      {name: 'HS', icon: 'hs'},
      {name: 'Hand', icon: 'hand'},
      {name: 'Mana', icon: 'mana'},
      {name: 'Shield', icon: 'shield'},
    ];
    const p2_items = [
      {name: 'Hand', icon: 'hand'},
      {name: 'Mana', icon: 'mana'},
      {name: 'Shield', icon: 'shield'},
      {name: 'Deck', icon: 'deck'},
      {name: 'Grave', icon: 'grave'},
      {name: 'HS', icon: 'hs'},
      {name: ''},
      {name: 'Battle', icon: 'battle'},
      {name: ''},
    ];

    const p2_grid = PhaserComponents.getGridTable(this, (GAME.WORLD.WIDTH-(GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/4) + 5, 160, (GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/2 - 30, 200, p2_items);
    const p1_grid = PhaserComponents.getGridTable(this, (GAME.WORLD.WIDTH-(GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/4) + 5, GAME.STAGE.HEIGHT - 160, (GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/2 - 30, 200, p1_items);

    setTimeout(() => {
      p1_grid.items.forEach(item => {
        item.value = '1';
      });
      p1_grid.refresh();
    }, 2000);
  }
}
