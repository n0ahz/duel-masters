import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableDataSource } from '@angular/material/table';
import { GameInterface } from '../../../interfaces/game.interface';
import { Router } from '@angular/router';
import { SocketService } from '../../../services/socket.service';
import { GameService } from '../../../services/game.service';
import { GamesCommandsEnum } from '../../../enums/gateway/games-events.enum';


@Component({
    selector: 'app-game-list',
    templateUrl: './game-list.component.html',
    styleUrls: ['./game-list.component.scss'],
    standalone: false
})
export class GameListComponent implements OnInit {

  dataSource = new MatTableDataSource<GameInterface>();
  displayedColumns = ['name', 'createdAt', 'gameType', 'status', 'inviter', 'challenger', 'gameIdentifier', 'join', 'delete'];

  private destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private socketService: SocketService,
    private gameService: GameService,
  ) {
    this.gameService.getGames();
  }

  ngOnInit() {
    this.gameService.gamesList$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(games => {
        this.dataSource.data = games;
      });
  }

  enableDelete(element: GameInterface) {
    return this.socketService.getCurrentSocketId() === element.inviter;
  }

  redirectToDetails(element: GameInterface) {
    this.router.navigateByUrl(`/games/view/${element.gameIdentifier}`);
  }

  redirectToDelete(element: GameInterface) {
    this.socketService.emitTo(element.gameIdentifier, GamesCommandsEnum.LEAVE_GAME);
    this.gameService.getGames();
  }
}
