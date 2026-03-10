import { Component, OnInit } from '@angular/core';
import { GameInterface } from '../../../interfaces/game.interface';
import { GameStatusEnum, GameTypesEnum } from '../../../enums/games.enum';
import { Router } from '@angular/router';
import * as uuid from 'uuid';
import { SocketService } from '../../../services/socket.service';
import { GameService } from '../../../services/game.service';


@Component({
    selector: 'app-game-add',
    templateUrl: './game-add.component.html',
    styleUrls: ['./game-add.component.scss'],
    standalone: false
})
export class GameAddComponent implements OnInit {

  game: GameInterface;

  constructor(
    private router: Router,
    private socketService: SocketService,
    private gameService: GameService,
  ) {}

  ngOnInit() {}

  onSubmit(name?: string, gameType?: GameTypesEnum) {
    this.game = {
      name,
      inviter: this.socketService.getCurrentSocketId(),
      gameType: GameTypesEnum[gameType],
      gameIdentifier: uuid.v4(),
      createdAt: new Date().toLocaleTimeString(),
      status: GameStatusEnum.PENDING,
    };
    this.gameService.addGame(this.game);
    this.router.navigateByUrl('games/list');
  }
}
