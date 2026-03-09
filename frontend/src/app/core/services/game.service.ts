import { Injectable, DestroyRef, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  GameInterface,
  GameStateInterface,
  GameEvents,
  DeckInterface,
} from '@dm/shared';
import { SocketService } from './socket.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private destroyRef = inject(DestroyRef);

  games$ = new BehaviorSubject<GameInterface[]>([]);
  gameState$ = new BehaviorSubject<GameStateInterface | null>(null);
  currentGame$ = new BehaviorSubject<GameInterface | null>(null);
  decks$ = new BehaviorSubject<DeckInterface[]>([]);

  constructor(private socketService: SocketService) {
    this.socketService
      .on<GameInterface[]>(GameEvents.GAMES_LIST)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((games) => this.games$.next(games));

    this.socketService
      .on<GameInterface>(GameEvents.GAME_CREATED)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((game) =>
        this.games$.next([...this.games$.value, game]),
      );

    this.socketService
      .on<GameStateInterface>(GameEvents.GAME_STATE_UPDATE)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => this.gameState$.next(state));

    this.socketService
      .on<DeckInterface[]>(GameEvents.DECKS_LIST)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((decks) => this.decks$.next(decks));

    this.socketService
      .on<DeckInterface>(GameEvents.DECK_CREATED)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((deck) =>
        this.decks$.next([deck, ...this.decks$.value]),
      );

    this.socketService
      .on<{ deckId: string }>(GameEvents.DECK_DELETED)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ deckId }) =>
        this.decks$.next(this.decks$.value.filter((d) => d._id !== deckId)),
      );

    this.socketService
      .on<DeckInterface>(GameEvents.DECK_UPDATED)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updated) =>
        this.decks$.next(
          this.decks$.value.map((d) => (d._id === updated._id ? updated : d)),
        ),
      );
  }
}
