import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameInterface } from '../../../interfaces/game.interface';
import { CoinSidesEnum } from '../../../enums/coin-sides.enum';
import { CoinTossResultInterface } from '../../../interfaces/coin-toss-result.interface';
import { SocketPayloadInterface } from '../../../interfaces/socket-payload.interface';
import { SocketService } from '../../../services/socket.service';
import { GamesEventsEnum } from '../../../enums/gateway/games-events.enum';
import { CommonEventsEnum } from '../../../enums/gateway/common-events.enum';
import { CoinTossEventsEnum } from '../../../enums/gateway/coin-toss-events.enum';
import { GameService } from '../../../services/game.service';
import { GameStatusEnum } from '../../../enums/games.enum';


@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GameViewComponent implements OnInit, OnDestroy {

  gameIdentifier: string;
  inviterSocketId: string;
  coinTossDisabled: boolean;
  opponentSelectedCoinSide: CoinSidesEnum;
  duelDecisionDisabled: boolean;
  duelDecisionValue: boolean;
  msgs: string[];
  activeUsers: string[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public socketService: SocketService,
    private gameService: GameService,
  ) {
  }

  get game(): GameInterface {
    return this.gameService.game;
  }

  set game(data: GameInterface) {
    this.gameService.game = data;
  }

  ngOnInit() {
    this.gameIdentifier = this.route.snapshot.params.gameIdentifier;
    this.coinTossDisabled = true;
    this.duelDecisionDisabled = true;
    this.msgs = [];
    this.activeUsers = [];
    this.socketService.emitTo(this.gameIdentifier, GamesEventsEnum.JOIN_GAME);

    this.socketService.emit(GamesEventsEnum.GET_GAME, { gameIdentifier: this.gameIdentifier });

    this.socketService.handleEvent(GamesEventsEnum.GAME_INFO, (res) => {
      this.game = res.data.game;
      if (!this.game) {
        this.addMessage('No game found!');
        setTimeout(() => {
          this.router.navigateByUrl('/games/list');
        }, 2000);
      } else {
        this.inviterSocketId = this.game.inviter;
        this.coinTossDisabled = this.canChooseCoinSide();
      }
    });

    this.socketService.handleEvent(GamesEventsEnum.USER_INFO, (res) => {
      this.activeUsers = res.data.users;
    });

    this.socketService.handleEvent(GamesEventsEnum.INVITER_LEFT, (res) => {
      setTimeout(() => {
        this.router.navigateByUrl('/games/list');
      }, 2000);
    });
    window.onbeforeunload = () => {
      this.gameService.leaveGame();
    };

    this.socketService.handleEvent(GamesEventsEnum.SET_CHALLENGER, (res) => {
      this.addMessage(res.data.msg);
      this.game.challenger = res.data.challenger;
      this.coinTossDisabled = this.canChooseCoinSide();
    });

    this.socketService.handleEvent(CoinTossEventsEnum.SET_COIN_SIDE, (res) => {
      this.addMessage(`<b>${this.getPlayerSide(res.data.chooser)}</b> chose the coin side: ${res.data.coinSide.toUpperCase()}!`);
      this.opponentSelectedCoinSide = res.data.coinSide;
    });

    this.socketService.handleEvent(CoinTossEventsEnum.START_COIN_FLIP, (res) => {
      this.addMessage(`<b>${this.getPlayerSide(res.data.flipper)}</b> flipped the coin...`);
      this.coinTossDisabled = true;
    });

    this.socketService.handleEvent(CoinTossEventsEnum.SET_DUEL_DECISION, (res) => {
      if (!this.isPlayer()) {
        this.addMessage(res.data.msg);
      } else {
        this.addMessage(`<b>${this.getPlayerSide(res.data.firstToGo)}</b> will go first!`);
      }
      this.game.firstToGo = res.data.firstToGo;
      this.socketService.emitTo(this.gameIdentifier, GamesEventsEnum.SET_FIRST_TO_GO, { firstToGo: res.data.firstToGo });
      // inverse the result for proper scenario..
      if (this.socketService.getCurrentSocketId() !== res.data.decisionMaker) {
        this.duelDecisionValue = !res.data.duelDecision;
      } else {
        this.duelDecisionValue = res.data.duelDecision;
      }
    });

    this.socketService.handleEvent(GamesEventsEnum.RESET_GAME, (res) => {
      this.coinTossDisabled = this.canChooseCoinSide();
      this.duelDecisionDisabled = true;
      this.duelDecisionValue = null;
      this.game.firstToGo = null;
    });

    this.socketService.handleEvent(GamesEventsEnum.DUEL, (res) => {
      this.game.status = GameStatusEnum.IN_PROGRESS;
      this.router.navigateByUrl('/duel');
    });

    this.socketService.handleEvent(CommonEventsEnum.MSG_TO_CLIENT, (res: SocketPayloadInterface) => {
      this.addMessage(res.data.msg);
    });
  }

  addMessage(msg: string) {
    if (msg) {
      this.msgs.push(msg);
    }
  }

  challengeButtonEnabled() {
    return !this.game.challenger && this.socketService.getCurrentSocketId() !== this.inviterSocketId;
  }

  challenge() {
    this.socketService.emitTo(this.gameIdentifier, GamesEventsEnum.CHALLENGE, { challenger: this.socketService.getCurrentSocketId() });
  }

  changeCoinSideSelection(value: string) {
    this.socketService.emitTo(this.gameIdentifier, CoinTossEventsEnum.COIN_SIDE_CHOSEN, { coinSide: value });
  }

  changeDuelDecisionSelection(value: boolean) {
    this.socketService.emitTo(this.gameIdentifier, CoinTossEventsEnum.DUEL_DECISION_MADE, {
      duelDecision: value,
      game: this.game,
    });
  }

  sendMessage(target: any, value: string) {
    if (value) {
      value = this.socketService.getCurrentSocketId() + ': ' + value;
      this.socketService.emitTo(this.gameIdentifier, CommonEventsEnum.MSG_TO_SERVER, {
        gameRoom: `${this.inviterSocketId}`,
        data: { msg: value },
      });
      target.value = '';
    }
  }

  checkKeyInput(event: any, value: string) {
    if (event.shiftKey && event.key === 'Enter') {
      value += '\n';
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage(event.target, value);
    }
  }

  getPlayerSide(socketId: string): string {
    let side = 'Challenger';
    // if same, then the viewer is the initiator
    if (this.socketService.getCurrentSocketId() === socketId) {
      side = 'You';
    }
    return side;
  }

  isPlayer(): boolean {
    return [this.game.inviter, this.game.challenger].indexOf(this.socketService.getCurrentSocketId()) !== -1;
  }

  getCoinTossResult(coinTossResult: CoinTossResultInterface) {
    let msg = '';
    if (coinTossResult.won) {
      msg = 'won the toss!';
    } else {
      msg = 'lost the toss!';
    }
    msg = `<b>${this.getPlayerSide(coinTossResult.flipper)}</b> ` + msg;
    this.addMessage(msg);
    this.coinTossDisabled = true;

    // enable decision selection of of 1st to go for proper duelist..
    if ((coinTossResult.won && this.socketService.getCurrentSocketId() === coinTossResult.flipper) || (!coinTossResult.won && this.socketService.getCurrentSocketId() === this.inviterSocketId)) {
      this.duelDecisionDisabled = false;
    }
  }

  canChooseCoinSide() {
    return !(this.game && this.game.challenger && this.socketService.getCurrentSocketId() === this.game.challenger);
  }

  enterGame() {
    this.socketService.emitTo(this.gameIdentifier, GamesEventsEnum.START_DUEL);
  }

  ngOnDestroy(): void {
    if (this.game.status === GameStatusEnum.PENDING) {
      this.gameService.leaveGame();
    }
    this.socketService.removeAllListeners();
  }

}
