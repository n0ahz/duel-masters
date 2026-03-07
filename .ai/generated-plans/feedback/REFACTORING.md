# Duel Masters — Code Organisation & Refactoring Plan

This document analyses how enums, interfaces, socket events, state, and service abstractions are currently organised and proposes concrete improvements.

---

## 1. Shared Models — Stop Duplicating Enums and Interfaces

### Current Problem

Six files are **byte-for-byte identical** between backend and frontend and must be kept in sync by hand:

| File | Backend | Frontend |
|---|---|---|
| `games.enum.ts` | `dm-backend/src/enums/` | `dm-frontend/src/app/enums/` |
| `games-events.enum.ts` | `dm-backend/src/enums/gateway/` | `dm-frontend/src/app/enums/gateway/` |
| `common-events.enum.ts` | same | same |
| `coin-toss-events.enum.ts` | same | same |
| `duel-events.enum.ts` | same | same |
| `game.interface.ts` | `dm-backend/src/interfaces/` | `dm-frontend/src/app/interfaces/` |
| `socket-payload.interface.ts` | same | same |

The `shared/` folder at the monorepo root already exists but is empty.

### Proposed Structure

```
duel-masters/
├── shared/
│   ├── package.json            ← new: { "name": "@dm/shared" }
│   ├── enums/
│   │   ├── game.enum.ts        ← GameStatusEnum, GameTypesEnum
│   │   └── gateway/
│   │       ├── games-events.enum.ts
│   │       ├── common-events.enum.ts
│   │       ├── coin-toss-events.enum.ts
│   │       └── duel-events.enum.ts
│   └── interfaces/
│       ├── game.interface.ts
│       ├── socket-payload.interface.ts
│       ├── card.interface.ts
│       └── zone-card.interface.ts
├── dm-backend/
└── dm-frontend/
```

Both `dm-backend/tsconfig.json` and `dm-frontend/tsconfig.json` add a path alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@dm/shared/*": ["../../shared/*"]
    }
  }
}
```

All duplicate files in backend and frontend are then deleted and replaced with:
```typescript
export { GamesEventsEnum } from '@dm/shared/enums/gateway/games-events.enum';
```

---

## 2. Card Interface — Fix the Type Safety Mismatch

### Current Problem

The `CardInterface` diverged between the two sides:

```typescript
// dm-backend/src/interfaces/card.interface.ts — untyped strings
export interface CardInterface {
  _civilization: string;
  _rarity?: string;
  race?: string;
}

// dm-frontend/src/app/interfaces/card.interface.ts — strongly typed
export interface CardInterface {
  _civilization: CivilizationsEnum;
  _rarity?: RaritiesEnum;
  race?: RacesEnum;
}
```

Because the backend uses `string`, it cannot validate card data. Malformed civilization or rarity values pass silently.

### Fix

Move the typed version to `shared/interfaces/card.interface.ts` and move the enums it depends on (`CivilizationsEnum`, `RaritiesEnum`, `RacesEnum`) to `shared/enums/` as well. Both sides then import from shared.

---

## 3. ZoneCard Interface — Reconcile the Divergence

### Current Problem

```typescript
// Backend — only 2 fields
export interface ZoneCardInterface {
  card: CardInterface;
  uid?: string;
}

// Frontend — 2 extra fields
export interface ZoneCardInterface {
  card: CardInterface;
  uid?: string;
  isTapped?: boolean;   // not initialised by backend
  ownerId?: string;     // not sent by backend
}
```

The backend sends `ZoneCardInterface` objects over the socket but never sets `isTapped` or `ownerId`. The frontend `ZoneCard` class receives these and they default to `undefined`, silently breaking tap-state tracking.

### Fix

Unify the interface in shared with all four fields. The backend must explicitly set `ownerId` when building the duel deck:

```typescript
// duel.gateway.ts — when initialising cards
cards.forEach((card) => {
  card.uid = uuid.v4();
  card.ownerId = client.id;   // ← add this
  card.isTapped = false;      // ← add this
});
```

---

## 4. Socket Events — Separate Requests from Responses

### Current Problem

All events (both client→server and server→client) live in the same enum with no indication of direction. A developer reading `GamesEventsEnum` cannot tell which events they should emit and which they should listen to.

```typescript
export enum GamesEventsEnum {
  ADD_GAME = 'addGame',       // ← request (emit)
  GET_GAMES = 'getGames',     // ← request (emit)
  GAMES_LIST = 'gamesList',   // ← response (listen)
  GAME_INFO = 'gameInfo',     // ← response (listen)
  JOIN_GAME = 'joinGame',     // ← request (emit)
  USER_INFO = 'userInfo',     // ← response (listen)
  // ... 10 more mixed together
}
```

### Fix

Split each event enum into `Commands` (client → server) and `Events` (server → client):

```typescript
// shared/enums/gateway/games-events.enum.ts

/** Commands: the client sends these */
export enum GamesCommandsEnum {
  ADD_GAME     = 'addGame',
  GET_GAME     = 'getGame',
  GET_GAMES    = 'getGames',
  JOIN_GAME    = 'joinGame',
  LEAVE_GAME   = 'leaveGame',
  CHALLENGE    = 'challenge',
  SET_FIRST_TO_GO = 'setFirstToGo',
  RESET_GAME   = 'resetGame',
  START_DUEL   = 'startDuel',
}

/** Events: the server emits these */
export enum GamesEventsEnum {
  GAMES_LIST    = 'gamesList',
  GAME_INFO     = 'gameInfo',
  USER_INFO     = 'userInfo',
  SET_CHALLENGER = 'setChallenger',
  INVITER_LEFT  = 'inviterLeft',
  DUEL          = 'duel',
}
```

Apply the same split to `DuelEventsEnum` and `CoinTossEventsEnum`.

---

## 5. SocketService — Add Type Safety

### Current Problem

`SocketService` accepts `string` for event names and `any` for data. Nothing prevents a typo in an event name or passing the wrong payload shape.

```typescript
// socket.service.ts — current
emit(event: string, data?: any) { ... }
emitTo(gameRoom: string, event: string, data?: any) { ... }
handleEvent(event: string, callback?: any) { ... }
```

### Fix

Define an event-payload map and type the service against it:

```typescript
// shared/interfaces/socket-event-map.interface.ts

export interface SocketCommandMap {
  [GamesCommandsEnum.ADD_GAME]:     { game: GameInterface };
  [GamesCommandsEnum.GET_GAMES]:    undefined;
  [GamesCommandsEnum.JOIN_GAME]:    undefined;
  [GamesCommandsEnum.LEAVE_GAME]:   undefined;
  [GamesCommandsEnum.CHALLENGE]:    undefined;
  [DuelCommandsEnum.SET_UP]:        { game: GameInterface };
  [DuelCommandsEnum.DROP_CARDS]:    { zoneCards: ZoneCardInterface[]; targetZone: string };
  // ...
}

export interface SocketEventMap {
  [GamesEventsEnum.GAMES_LIST]:  { games: GameInterface[] };
  [GamesEventsEnum.GAME_INFO]:   { game: GameInterface };
  [GamesEventsEnum.USER_INFO]:   { users: string[] };
  // ...
}
```

```typescript
// socket.service.ts — updated
emit<K extends keyof SocketCommandMap>(
  event: K,
  data?: SocketCommandMap[K]
): void {
  this.socket.emit(event, { data });
}

on<K extends keyof SocketEventMap>(
  event: K,
  callback: (data: SocketEventMap[K]) => void
): void {
  this.socket.on(event, (res: SocketPayloadInterface) => callback(res.data));
}
```

With this change, `socketService.emit(GamesCommandsEnum.ADD_GAME, { game })` is type-checked. Passing the wrong payload is a compile error.

---

## 6. GameService — Consolidate All Socket Operations

### Current Problem

`GameService` only exposes one method (`leaveGame()`). All other game actions are emitted directly from components, bypassing the service layer.

```typescript
// game-list.component.ts — direct socket call
this.socketService.emit(GamesEventsEnum.GET_GAMES);

// game-view.component.ts — direct socket calls
this.socketService.emitTo(this.gameIdentifier, GamesEventsEnum.JOIN_GAME);
this.socketService.emit(GamesEventsEnum.GET_GAME, { gameIdentifier: this.gameIdentifier });
```

Components should not know about socket event names.

### Fix

Move all game-related socket emit/listen calls into `GameService`. Components inject `GameService` and call methods:

```typescript
// game.service.ts — proposed
export class GameService {
  readonly game$: Observable<GameInterface>;
  readonly gamesList$: Observable<GameInterface[]>;
  readonly activeUsers$: Observable<string[]>;

  addGame(game: GameInterface): void {
    this.socketService.emit(GamesCommandsEnum.ADD_GAME, { game });
  }

  getGames(): void {
    this.socketService.emit(GamesCommandsEnum.GET_GAMES);
  }

  joinGame(gameIdentifier: string): void {
    this.socketService.emitTo(gameIdentifier, GamesCommandsEnum.JOIN_GAME);
    this.socketService.emit(GamesCommandsEnum.GET_GAME, { gameIdentifier });
  }

  leaveGame(): void {
    this.socketService.emitTo(this.game.gameIdentifier, GamesCommandsEnum.LEAVE_GAME);
  }

  challenge(gameIdentifier: string): void {
    this.socketService.emitTo(gameIdentifier, GamesCommandsEnum.CHALLENGE);
  }

  private listenToEvents(): void {
    this.socketService.on(GamesEventsEnum.GAME_INFO, res => this._game$.next(res.game));
    this.socketService.on(GamesEventsEnum.GAMES_LIST, res => this._gamesList$.next(res.games));
    this.socketService.on(GamesEventsEnum.USER_INFO, res => this._activeUsers$.next(res.users));
  }
}
```

Components then reduce to:

```typescript
// game-list.component.ts — simplified
ngOnInit() {
  this.gameService.getGames();
  this.gameService.gamesList$.pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(games => this.dataSource.data = games);
}
```

Apply the same pattern for duel and coin toss events using dedicated `DuelService` methods.

---

## 7. Backend — Extract a Service Layer from Gateways

### Current Problem

All business logic lives directly inside gateway handler methods. Gateways mix WebSocket protocol concerns (parsing payloads, emitting events) with game logic (managing rooms, coin tosses):

```typescript
// games.gateway.ts — business logic embedded in protocol handler
@SubscribeMessage(GamesEventsEnum.JOIN_GAME)
joinGame(client: Socket, payload: SocketPayloadInterface) {
  // room management, user tracking, game state updates — all inline
}
```

### Fix

Introduce a service class per domain that the gateway delegates to:

```
dm-backend/src/
├── gateway/
│   ├── games.gateway.ts          ← parse payload, call service, emit response
│   ├── duel.gateway.ts
│   └── duel-decision.gateway.ts
└── services/
    ├── game-room.service.ts      ← game room CRUD, user tracking
    ├── duel.service.ts           ← duel state, card management
    └── coin-toss.service.ts      ← coin toss / decision logic
```

```typescript
// game-room.service.ts
@Injectable()
export class GameRoomService {
  private rooms: Map<string, GameInterface> = new Map();

  add(game: GameInterface): void { this.rooms.set(game.gameIdentifier, game); }
  get(id: string): GameInterface | undefined { return this.rooms.get(id); }
  remove(id: string): void { this.rooms.delete(id); }
  all(): GameInterface[] { return Array.from(this.rooms.values()); }
}

// games.gateway.ts — becomes thin
@SubscribeMessage(GamesCommandsEnum.ADD_GAME)
addGame(client: Socket, payload: SocketPayloadInterface): void {
  const game = payload?.data?.game;
  if (!game?.gameIdentifier) return;
  this.gameRoomService.add(game);
  this.server.emit(GamesEventsEnum.GAMES_LIST, { data: { games: this.gameRoomService.all() } });
}
```

This also makes unit-testing game logic trivial — test `GameRoomService` without needing Socket.io.

---

## 8. Backend — Use `Map` for Game Rooms

### Current Problem

```typescript
// games.gateway.ts
gameRooms: { [gameIdentifier: string]: GameInterface } = {};  // plain object
users: string[] = [];  // plain array with duplicates
```

Plain objects used as hash maps lose type safety. Arrays allow duplicate socket IDs.

### Fix

```typescript
private rooms = new Map<string, GameInterface>();
private users = new Set<string>();
```

`Map` has proper iteration, `has()`, `get()`, `delete()` semantics and better performance. `Set` prevents duplicate user registrations.

---

## 9. Constants — One Source of Truth

### Current Problem

Game constants only exist in the frontend:

```
dm-frontend/src/app/constants/game.ts   ← deck sizes, zone limits, etc.
dm-backend/src/                          ← no equivalent
```

If any limit changes, it changes in only one place but should be enforced by both sides.

### Fix

Move game constants to `shared/constants/game.ts` and import them in both backend (for validation) and frontend (for UI rules).

---

## 10. Folder Structure — Proposed End State

### Backend

```
dm-backend/src/
├── gateway/
│   ├── games.gateway.ts
│   ├── duel.gateway.ts
│   ├── duel-decision.gateway.ts
│   └── main.gateway.ts
├── services/                         ← NEW
│   ├── game-room.service.ts
│   ├── duel.service.ts
│   └── coin-toss.service.ts
├── utils/
│   └── gateway.utility.ts
└── app.module.ts
```

Interfaces, enums, and constants are imported from `@dm/shared`.

### Frontend

```
dm-frontend/src/app/
├── services/
│   ├── socket.service.ts             ← add generic typed overloads
│   ├── game.service.ts               ← consolidate all game socket ops
│   └── duel.service.ts               ← consolidate all duel socket ops
├── components/
│   └── ...                           ← components only call services
├── game-engine/
│   ├── scenes/
│   ├── factories/
│   └── ...
└── app.module.ts
```

Frontend-only enums (ZonesEnum, PhasesEnum, PlayerSidesEnum, etc.) stay in `dm-frontend/src/app/enums/`.
Shared enums (GameStatusEnum, all gateway event enums) are imported from `@dm/shared`.

### Shared

```
shared/
├── package.json
├── enums/
│   ├── game.enum.ts
│   └── gateway/
│       ├── games-events.enum.ts      ← split into Commands + Events
│       ├── common-events.enum.ts
│       ├── coin-toss-events.enum.ts
│       └── duel-events.enum.ts
├── interfaces/
│   ├── game.interface.ts
│   ├── socket-payload.interface.ts
│   ├── socket-event-map.interface.ts ← NEW
│   ├── card.interface.ts             ← unified with enums
│   └── zone-card.interface.ts        ← unified with isTapped + ownerId
└── constants/
    └── game.ts                       ← moved from dm-frontend
```

---

## Summary Table

| # | Issue | Where | Priority |
|---|---|---|---|
| 1 | Enums & interfaces duplicated across backend and frontend | `enums/`, `interfaces/` both sides | High |
| 2 | `CardInterface` uses `string` on backend, enums on frontend | `card.interface.ts` | High |
| 3 | `ZoneCardInterface` missing `isTapped`/`ownerId` on backend | `zone-card.interface.ts` | Medium |
| 4 | No distinction between command events (emit) and response events (listen) | All event enums | High |
| 5 | `SocketService` typed with `string` and `any` — no compile-time safety | `socket.service.ts` | High |
| 6 | Components emit socket events directly, bypassing `GameService` | All components | Medium |
| 7 | Business logic embedded in gateway handlers — no service layer | Backend gateways | Medium |
| 8 | `gameRooms` uses plain object; `users` uses array (allows duplicates) | `games.gateway.ts` | Medium |
| 9 | Game constants only defined on frontend | `constants/game.ts` | Low |
| 10 | `shared/` folder exists but is empty | Repo root | High |
