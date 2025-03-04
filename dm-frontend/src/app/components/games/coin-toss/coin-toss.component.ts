import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CoinSidesEnum } from '../../../enums/coin-sides.enum';
import { CoinTossResultInterface } from '../../../interfaces/coin-toss-result.interface';
import { SocketService } from '../../../services/socket.service';
import { GameInterface } from '../../../interfaces/game.interface';
import { CoinTossEventsEnum } from '../../../enums/gateway/coin-toss-events.enum';


@Component({
  selector: 'app-coin-toss',
  templateUrl: './coin-toss.component.html',
  styleUrls: ['./coin-toss.component.scss'],
})
export class CoinTossComponent implements OnInit, OnDestroy {

  coinClass: CoinSidesEnum;
  flipTimer: number;
  publishResult: number;
  @Input() game: GameInterface;
  @Input() selectedSide: CoinSidesEnum;
  @Input() disabled: boolean;
  @Output() won = new EventEmitter<CoinTossResultInterface>();

  constructor(
    private socketService: SocketService,
  ) {
  }

  ngOnInit() {
    this.coinClass = null;
    this.flipTimer = 3000;

    this.socketService.handleEvent(CoinTossEventsEnum.START_COIN_FLIP, (res) => {
      this.flip(res.data.flipResult, res.data.flipper);
    });
  }

  startFlip() {
    const flipResult = Math.random();
    this.disabled = true;
    this.socketService.emitTo(this.game.gameIdentifier, CoinTossEventsEnum.COIN_FLIPPED, { flipResult });
  }

  flip(flipResult: number, flipper: string) {
    this.coinClass = null;
    setTimeout(() => {
      if (flipResult <= 0.5) {
        this.coinClass = CoinSidesEnum.HEADS;
      } else {
        this.coinClass = CoinSidesEnum.TAILS;
      }
      this.publishResult = setTimeout(() => {
        this.won.emit({ won: this.coinClass === this.selectedSide, flipper });
      }, this.flipTimer);
    }, 100);
  }

  ngOnDestroy(): void {
    this.socketService.removeAllListeners();
  }

}
