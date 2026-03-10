import { Component, DestroyRef, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { GameInterface } from '../../../interfaces/game.interface';
import { CoinSidesEnum } from '../../../enums/coin-sides.enum';
import { CoinTossResultInterface } from '../../../interfaces/coin-toss-result.interface';
import { SocketService } from '../../../services/socket.service';
import { GamesCommandsEnum, GamesEventsEnum } from '../../../enums/gateway/games-events.enum';
import { CommonCommandsEnum, CommonEventsEnum } from '../../../enums/gateway/common-events.enum';
import { CoinTossCommandsEnum, CoinTossEventsEnum } from '../../../enums/gateway/coin-toss-events.enum';
import { GameService } from '../../../services/game.service';
import { GameStatusEnum } from '../../../enums/games.enum';


@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
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

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public socketService: SocketService,
    private gameService: GameService,
  ) {}

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

    this.gameService.joinGame(this.gameIdentifier);

    this.gameService.activeUsers$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => { this.activeUsers = users; });

    this.socketService.fromEvent(GamesEventsEnum.GAME_INFO)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.game = res?.data?.game;
        if (!this.game) {
          this.addMessage('No game found!');
          setTimeout(() => this.router.navigateByUrl('/games/list'), 2000);
        } else {
          this.inviterSocketId = this.game.inviter;
          this.coinTossDisabled = this.canChooseCoinSide();
        }
      });

    this.socketService.fromEvent(GamesEventsEnum.INVITER_LEFT)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        setTimeout(() => this.router.navigateByUrl('/games/list'), 2000);
      });

    window.onbeforeunload = () => { this.gameService.leaveGame(); };

    this.socketService.fromEvent(GamesEventsEnum.SET_CHALLENGER)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        const msg = res?.data?.msg;
        if (typeof msg === 'string') this.addMessage(msg);
        this.game.challenger = res?.data?.challenger;
        this.coinTossDisabled = this.canChooseCoinSide();
      });

    this.socketService.fromEvent(CoinTossEventsEnum.SET_COIN_SIDE)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.addMessage(`<b>${this.getPlayerSide(res.data.chooser)}</b> chose the coin side: ${res.data.coinSide.toUpperCase()}!`);
        this.opponentSelectedCoinSide = res.data.coinSide as any;
      });

    this.socketService.fromEvent(CoinTossEventsEnum.START_COIN_FLIP)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.addMessage(`<b>${this.getPlayerSide(res.data.flipper)}</b> flipped the coin...`);
        this.coinTossDisabled = true;
      });

    this.socketService.fromEvent(CoinTossEventsEnum.SET_DUEL_DECISION)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        if (!this.isPlayer()) {
          this.addMessage(res.data.msg);
        } else {
          this.addMessage(`<b>${this.getPlayerSide(res.data.firstToGo)}</b> will go first!`);
        }
        this.game.firstToGo = res.data.firstToGo;
        this.gameService.setFirstToGo(this.gameIdentifier, res.data.firstToGo);
        if (this.socketService.getCurrentSocketId() !== res.data.decisionMaker) {
          this.duelDecisionValue = !res.data.duelDecision;
        } else {
          this.duelDecisionValue = res.data.duelDecision;
        }
      });

    this.socketService.fromEvent(GamesEventsEnum.RESET_GAME)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.coinTossDisabled = this.canChooseCoinSide();
        this.duelDecisionDisabled = true;
        this.duelDecisionValue = null;
        this.game.firstToGo = null;
      });

    this.socketService.fromEvent(GamesEventsEnum.DUEL)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.game.status = GameStatusEnum.IN_PROGRESS;
        this.router.navigateByUrl('/duel');
      });

    this.socketService.fromEvent(CommonEventsEnum.MSG_TO_CLIENT)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        const msg = res?.data?.msg;
        if (typeof msg === 'string') this.addMessage(msg);
      });
  }

  addMessage(msg: string) {
    if (msg) this.msgs.push(msg);
  }

  challengeButtonEnabled() {
    return !this.game.challenger && this.socketService.getCurrentSocketId() !== this.inviterSocketId;
  }

  challenge() {
    this.gameService.challenge(this.gameIdentifier);
  }

  changeCoinSideSelection(value: string) {
    this.socketService.emitTo(this.gameIdentifier, CoinTossCommandsEnum.COIN_SIDE_CHOSEN, { coinSide: value });
  }

  changeDuelDecisionSelection(value: boolean) {
    this.socketService.emitTo(this.gameIdentifier, CoinTossCommandsEnum.DUEL_DECISION_MADE, {
      duelDecision: value,
      game: this.game,
    });
  }

  sendMessage(target: any, value: string) {
    if (value) {
      value = this.socketService.getCurrentSocketId() + ': ' + value;
      this.socketService.emitTo(this.gameIdentifier, CommonCommandsEnum.MSG_TO_SERVER, { msg: value });
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
    return this.socketService.getCurrentSocketId() === socketId ? 'You' : 'Challenger';
  }

  isPlayer(): boolean {
    return [this.game.inviter, this.game.challenger].indexOf(this.socketService.getCurrentSocketId()) !== -1;
  }

  getCoinTossResult(coinTossResult: CoinTossResultInterface) {
    let msg = coinTossResult.won ? 'won the toss!' : 'lost the toss!';
    msg = `<b>${this.getPlayerSide(coinTossResult.flipper)}</b> ` + msg;
    this.addMessage(msg);
    this.coinTossDisabled = true;
    if ((coinTossResult.won && this.socketService.getCurrentSocketId() === coinTossResult.flipper) ||
        (!coinTossResult.won && this.socketService.getCurrentSocketId() === this.inviterSocketId)) {
      this.duelDecisionDisabled = false;
    }
  }

  canChooseCoinSide() {
    return !(this.game && this.game.challenger && this.socketService.getCurrentSocketId() === this.game.challenger);
  }

  enterGame() {
    this.gameService.startDuel(this.gameIdentifier);
  }

  ngOnDestroy(): void {
    if (this.game.status === GameStatusEnum.PENDING) {
      this.gameService.leaveGame();
    }
  }
}
