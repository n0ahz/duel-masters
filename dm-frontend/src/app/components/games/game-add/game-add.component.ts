import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameInterface } from '../../../interfaces/game.interface';
import { GameStatusEnum, GameTypesEnum } from '../../../enums/games.enum';
import { Router } from '@angular/router';
import * as uuid from 'uuid';
import { SocketService } from '../../../services/socket.service';
import { GamesEventsEnum } from '../../../enums/gateway/games-events.enum';


@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.scss'],
})
export class GameAddComponent implements OnInit, OnDestroy {

  game: GameInterface;

  constructor(
    private router: Router,
    private socketService: SocketService,
  ) {
  }

  ngOnInit() {
  }

  onSubmit(name?: string, gameType?: GameTypesEnum) {
    this.game = {
      name: name,
      inviter: this.socketService.getCurrentSocketId(),
      gameType: GameTypesEnum[gameType],
      gameIdentifier: uuid.v4(),
      createdAt: new Date().toLocaleTimeString(),
      status: GameStatusEnum.PENDING,
    };
    this.socketService.emit(GamesEventsEnum.ADD_GAME, { game: this.game });
    this.router.navigateByUrl('games/list');
  }

  ngOnDestroy(): void {
    this.socketService.removeAllListeners();
  }
}
