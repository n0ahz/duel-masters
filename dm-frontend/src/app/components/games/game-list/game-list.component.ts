import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GameInterface } from '../../../interfaces/game.interface';
import { Router } from '@angular/router';
import { SocketService } from '../../../services/socket.service';
import { GamesEventsEnum } from '../../../enums/gateway/games-events.enum';


@Component({
    selector: 'app-game-list',
    templateUrl: './game-list.component.html',
    styleUrls: ['./game-list.component.scss'],
    standalone: false
})
export class GameListComponent implements OnInit, OnDestroy {

  // games: GameInterface[];
  dataSource = new MatTableDataSource<GameInterface>();
  displayedColumns = ['name', 'createdAt', 'gameType', 'status', 'inviter', 'challenger', 'gameIdentifier', 'join', 'delete'];

  constructor(
    private router: Router,
    private socketService: SocketService,
  ) {
    this.socketService.emit(GamesEventsEnum.GET_GAMES);
  }

  ngOnInit() {
    // this.games = [];
    this.socketService.handleEvent(GamesEventsEnum.GAMES_LIST, (res) => {
      // this.games = res.data ? res.data.games : [];
      this.dataSource.data = res.data ? res.data.games : [];
    });
  }

  enableDelete(element: GameInterface) {
    return this.socketService.getCurrentSocketId() === element.inviter;
  }

  redirectToDetails(element: GameInterface) {
    this.router.navigateByUrl(`/games/view/${element.gameIdentifier}`);
  }

  redirectToDelete(element: GameInterface) {
    this.socketService.emitTo(element.gameIdentifier, GamesEventsEnum.LEAVE_GAME);
    this.socketService.emit(GamesEventsEnum.GET_GAMES);
  }

  ngOnDestroy(): void {
    this.socketService.removeAllListeners();
  }
}
