# Duel Masters — Improvement Plan

Generated from code review. Issues are grouped by theme and ordered by priority within each group.

---

## 1. Security

### 1.1 Move Hardcoded Google OAuth Client ID to Environment Config
**File:** `dm-frontend/src/app/app.module.ts:90`
**Severity:** Critical

**Problem:**
```typescript
provider: new GoogleLoginProvider('519801663676-moqibve9j510ppopc8mk8t3cdm72inef.apps.googleusercontent.com'),
```
The client ID is committed to source control and embedded in build artifacts.

**Fix:**
1. Add `googleClientId` to `dm-frontend/src/environments/environment.ts` and `environment.prod.ts`.
2. Inject `environment.googleClientId` in `app.module.ts` instead of the literal string.

---

## 2. Authorization & Security

### 2.1 Add Authorization Checks to All Gateway Handlers
**Files:** `dm-backend/src/gateway/games.gateway.ts`, `duel.gateway.ts`, `duel-decision.gateway.ts`
**Severity:** High

**Problem:**
Any connected client can call `leaveGame`, `challenge`, `setFirstToGo`, `startDuel`, etc. on any room. There is no verification that the client is a participant.

**Fix:**
Add a shared guard method and call it at the top of every privileged handler:

```typescript
private assertPlayerInGame(client: Socket, gameRoom: string): void {
  if (!client.rooms.has(gameRoom)) {
    throw new Error('Client is not in this game room');
  }
}

// For inviter-only actions:
private assertIsInviter(client: Socket, game: GameInterface): void {
  if (client.id !== game.inviter) {
    throw new Error('Only the inviter can perform this action');
  }
}
```

Apply to: `leaveGame`, `challenge`, `setFirstToGo`, `startDuel`, `dropCard`, `tapCard`, `untapCard`, `coinToss`, `chooseCoinSide`.

---

## 3. Error Handling

### 3.1 Null-Guard All `gameRooms[room]` Accesses
**File:** `dm-backend/src/gateway/games.gateway.ts:64,157,178,188`
**Severity:** High

**Problem:**
Methods access `this.gameRooms[room]` and immediately set properties on the result. A missing or invalid room causes a crash.

```typescript
// Crash if room not found:
game.challenger = client.id;
game.firstToGo = data.firstToGo;
game.status = GameStatusEnum.IN_PROGRESS;
```

**Fix:**
Guard every lookup and return an error event on failure:

```typescript
const game = this.gameRooms[room];
if (!game) {
  return { event: GamesEventsEnum.ERROR, data: { message: 'Game not found' } };
}
```

Apply this pattern to: `gameLeaveHandler`, `challenge`, `setFirstToGo`, `startDuel`, and all handlers in `duel.gateway.ts` and `duel-decision.gateway.ts`.

### 3.2 Emit Error Events to Clients on Failure
**Files:** All gateway files
**Severity:** Medium

**Problem:**
Errors are silently swallowed server-side. Clients have no signal that an action failed.

**Fix:**
Wrap all `@SubscribeMessage` handlers in try/catch and return a typed error event:

```typescript
@SubscribeMessage(GamesEventsEnum.CHALLENGE)
challenge(client: Socket, payload: SocketPayloadInterface) {
  try {
    // ... handler logic
  } catch (error: any) {
    return { event: 'error', data: { message: error.message } };
  }
}
```

Define an `ErrorEventsEnum` with a single `ERROR = 'error'` value and subscribe to it on the frontend to display user-facing error messages.

### 3.3 Add Null Safety to Frontend Socket Event Callbacks
**Files:** `game-view.component.ts`, `duel.scene.ts`
**Severity:** Medium

**Problem:**
Socket callbacks access nested properties without guards:
```typescript
this.game = res.data.game;      // res.data could be null
this.addMessage(res.data.msg);  // msg could be undefined
duelist1.duelDeck = res.data.duelDeck.map(...); // duelDeck could be missing
```

**Fix:**
Use optional chaining and validate before use:
```typescript
const game = res?.data?.game;
if (!game) { /* handle gracefully */ return; }
this.game = game;

const msg = res?.data?.msg;
if (typeof msg === 'string') this.addMessage(msg);
```

---

## 4. Memory Leaks

### 4.1 Clean Up Socket Event Subscriptions in Components
**Files:** `game-view.component.ts`, `game-list.component.ts`, `duel.component.ts`, `duel.scene.ts`
**Severity:** High

**Problem:**
`socketService.handleEvent(...)` is called in `ngOnInit` (or scene `create()`) but listeners are never removed. Each navigation cycle stacks another listener.

**Fix:**
Use a `destroy$` subject with `takeUntil` (or `takeUntilDestroyed` in Angular 16+):

```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.socketService.fromEvent(GamesEventsEnum.GAME_INFO)
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => { this.game = res.data.game; });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

This requires `SocketService.fromEvent()` to return an `Observable` (see §6.1).

### 4.2 Clean Up Phaser Event Listeners When Cards Are Destroyed
**File:** `dm-frontend/src/app/game-engine/zone-card.ts`
**Severity:** High

**Problem:**
`cardImageLoadHandler` registers drag/click/hover Phaser listeners on `this.cardImg`. When a card moves zones or is destroyed there is no cleanup, so stale listeners accumulate.

**Fix:**
Track listeners and destroy them explicitly:

```typescript
private destroyListeners(): void {
  this.cardImg.off('drag');
  this.cardImg.off('dragstart');
  this.cardImg.off('dragend');
  this.cardImg.off('drop');
  this.cardImg.off('pointerdown');
  this.cardImg.off('pointerover');
  this.cardImg.off('pointerout');
}

destroy(): void {
  this.destroyListeners();
  this.cardImg.destroy();
}
```

Call `destroyListeners()` at the start of `cardImageLoadHandler` before re-registering.

### 4.3 Fix `GameService` Self-Subscription
**File:** `dm-frontend/src/app/services/game.service.ts`
**Severity:** Low

**Problem:**
```typescript
this._game.asObservable().subscribe(game => this.game = game);
```
This internal subscription is never unsubscribed. The `this.game` field is redundant since consumers can subscribe to `_game` directly.

**Fix:**
Remove the subscription and the `game` field. Expose the observable and let consumers subscribe with `takeUntil`.

---

## 5. Logic Bugs

### 5.1 Fix Inverted Filter in `Player.removeDeck`
**File:** `dm-frontend/src/app/game-engine/player.ts:26`
**Severity:** High

**Problem:**
```typescript
// Keeps only the matching deck — opposite of intended behavior
this.decks = this.decks.filter(d => d === deck);
```

**Fix:**
```typescript
this.decks = this.decks.filter(d => d !== deck);
```

### 5.2 Fix Card Identity Comparison in `Deck.addCard`
**File:** `dm-frontend/src/app/game-engine/deck.ts:29`
**Severity:** Medium

**Problem:**
```typescript
// Compares object references, not card identity
this.cards.filter(eachCard => eachCard === card).length >= 4
```
Two separate `Card` instances with the same `collectorNo` are treated as different cards, allowing more than 4 copies.

**Fix:**
```typescript
this.cards.filter(c => c.collectorNo === card.collectorNo).length >= 4
```

### 5.3 Throw `Error` Objects, Not Strings
**File:** `dm-frontend/src/app/game-engine/deck.ts`
**Severity:** Low

**Problem:**
```typescript
throw 'Deck is full!';
throw 'Can\'t add same card more than 4 times in a deck!';
```
Thrown strings have no stack trace, making debugging difficult.

**Fix:**
```typescript
throw new Error('Deck is full!');
throw new Error('Cannot add more than 4 copies of the same card');
```

### 5.4 Replace `==` with `===` for Socket ID Comparisons
**File:** `dm-frontend/src/app/game-engine/duelist.ts:50–53`
**Severity:** Low

**Problem:**
```typescript
if (scene.gameService.game.inviter == scene.socketService.getCurrentSocketId())
```
Loose equality can cause unexpected coercion with string IDs.

**Fix:** Replace all `==` comparisons involving socket IDs or enum values with `===`.

---

## 6. State Management & Architecture

### 6.1 Replace `getGames` Broadcast with Targeted Emit
**File:** `dm-backend/src/gateway/games.gateway.ts:37`
**Severity:** Medium

**Problem:**
```typescript
// Sends the full game list to ALL connected clients when any one client requests it
this.server.emit(GamesEventsEnum.GAMES_LIST, response);
```

**Fix:**
Return the response only to the requesting client:
```typescript
@SubscribeMessage(GamesEventsEnum.GET_GAMES)
getGames(client: Socket, payload: SocketPayloadInterface) {
  client.emit(GamesEventsEnum.GAMES_LIST, {
    data: { games: Object.values(this.gameRooms) }
  });
}
```

Broadcast `GAMES_LIST` to all only when the list actually changes (after `addGame` or `leaveGame`).

### 6.2 Fix Race Condition — Use `Set` for Users Array
**File:** `dm-backend/src/gateway/games.gateway.ts:19,119`
**Severity:** High

**Problem:**
```typescript
users: string[] = [];
// ...
this.users.push(client.id); // No duplicate check — a reconnecting client is added twice
```

**Fix:**
```typescript
private users: Set<string> = new Set();
// ...
this.users.add(client.id);
```

Also remove the redundant `client.rooms.add(gameRoom)` call after `client.join(gameRoom)` — Socket.io handles this automatically.

### 6.3 Add In-Memory Game Cleanup
**File:** `dm-backend/src/gateway/games.gateway.ts`
**Severity:** Medium

**Problem:**
`gameRooms` and `persons` in `duel.gateway.ts` grow forever. Completed or abandoned games are never removed unless the inviter specifically calls `leaveGame`.

**Fix (short-term):**
Add a `createdAt` timestamp to `GameInterface` and run a cleanup interval:

```typescript
afterInit(server: Server): void {
  setInterval(() => {
    const expiry = Date.now() - 2 * 60 * 60 * 1000; // 2 hours
    for (const [id, game] of Object.entries(this.gameRooms)) {
      if (new Date(game.createdAt).getTime() < expiry) {
        delete this.gameRooms[id];
      }
    }
  }, 30 * 60 * 1000); // Run every 30 minutes
}
```

**Fix (long-term):**
Migrate game state to MongoDB using the already-configured TypeORM connection.

### 6.4 Add Input Validation to All Gateway Handlers
**Files:** All gateway files
**Severity:** Medium

**Problem:**
No validation of incoming socket message payloads. Malformed data (missing fields, wrong types) goes directly into game state or causes crashes.

**Fix:**
Add explicit field checks at the top of every handler before touching state:

```typescript
@SubscribeMessage(GamesEventsEnum.ADD_GAME)
addGame(client: Socket, payload: SocketPayloadInterface) {
  const game = payload?.data?.game;
  if (!game?.gameIdentifier || !game?.name || !game?.inviter) {
    return { event: 'error', data: { message: 'Invalid game payload' } };
  }
  this.gameRooms[game.gameIdentifier] = game;
  // ...
}
```

---

## 7. Type Safety

### 7.1 Make `SocketPayloadInterface` Generic
**Files:** `dm-backend/src/interfaces/socket-payload.interface.ts`, `dm-frontend/src/app/interfaces/socket-payload.interface.ts`
**Severity:** Medium

**Problem:**
```typescript
export interface SocketPayloadInterface {
  gameRoom?: string;
  data?: any; // bypasses all type checking
}
```

**Fix:**
```typescript
export interface SocketPayloadInterface<T = unknown> {
  gameRoom?: string;
  data?: T;
}

// Usage in gateways:
const response: SocketPayloadInterface<{ games: GameInterface[] }> = {
  data: { games: Object.values(this.gameRooms) },
};
```

---

## 8. Code Quality

### 8.1 Replace Nested `setTimeout` with `async/await`
**File:** `dm-frontend/src/app/game-engine/duelist.ts:47–75`
**Severity:** Medium

**Problem:**
Three levels of nested `setTimeout` with magic numbers make the game setup sequence hard to read and modify:
```typescript
setTimeout(() => {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => { /* deal shield */ }, 100 * i);
  }
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => { /* draw hand */ }, 100 * i);
    }
  }, 2000);
}, 3000);
```

**Fix:**
```typescript
private delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

private async startGameSequence(...) {
  const INITIAL_DELAY_MS = 3000;
  const DEAL_INTERVAL_MS = 100;
  const HAND_DELAY_MS = 2000;
  const INITIAL_CARD_COUNT = 5;

  await this.delay(INITIAL_DELAY_MS);

  for (let i = 0; i < INITIAL_CARD_COUNT; i++) {
    await this.delay(DEAL_INTERVAL_MS);
    deckZone.transferCards(deckZone.takeCards(1, PositionsEnum.BOTTOM), shieldZone);
  }

  await this.delay(HAND_DELAY_MS);

  for (let i = 0; i < INITIAL_CARD_COUNT; i++) {
    await this.delay(DEAL_INTERVAL_MS);
    deckZone.transferCards(deckZone.takeCards(1, PositionsEnum.BOTTOM), handZone);
  }
}
```

### 8.2 Replace `_.values()` with `Object.values()`
**File:** `dm-backend/src/gateway/games.gateway.ts:29,37`
**Severity:** Low

**Problem:**
Lodash is imported just for `_.values()`, which has a native equivalent.

**Fix:**
```typescript
// Before
games: _.values(this.gameRooms)

// After
games: Object.values(this.gameRooms)
```

Remove the lodash import from this file if it's the only usage.

### 8.3 Extract Magic Numbers to Named Constants
**Files:** `dm-frontend/src/app/game-engine/duelist.ts`, `duel.scene.ts`, `zone-card.ts`
**Severity:** Low

**Problem:**
Numeric literals like `3000`, `2000`, `100`, `0.95`, `500`, `250` are scattered throughout the game engine with no explanation.

**Fix:**
Create `dm-frontend/src/app/game-engine/constants/game-timings.ts` and `game-layout.ts`:

```typescript
export const GAME_TIMINGS = {
  START_SEQUENCE_DELAY_MS: 3000,
  HAND_DRAW_DELAY_MS: 2000,
  CARD_DEAL_INTERVAL_MS: 100,
  CARD_FLIP_DURATION_MS: 500,
};

export const GAME_LAYOUT = {
  CARD_SCALE_NORMAL: 0.95,
  CARD_SCALE_HOVER: 1.05,
};
```

### 8.4 Remove Debug `console.log` Calls
**Files:** `dm-frontend/src/app/services/duel.service.ts:44`, `game-engine/zone-card.ts:104`, `game-engine/duel-zone.ts:170`
**Severity:** Low

Remove all `console.log(card)`, `console.log(self.card)`, `console.log(this)` from production code. If logging is needed long-term, inject a `LoggerService` that can be toggled per environment.

---

## Issue Tracker Summary

| # | Issue | File(s) | Severity |
|---|-------|---------|----------|
| 1.1 | Hardcoded OAuth client ID | `app.module.ts` | Critical |
| 2.1 | No authorization checks in gateways | All gateways | High |
| 3.1 | No null guard on `gameRooms` lookups | `games.gateway.ts` | High |
| 3.2 | No error events emitted to clients | All gateways | Medium |
| 3.3 | No null safety in frontend socket callbacks | `game-view`, `duel.scene` | Medium |
| 4.1 | Socket subscriptions never unsubscribed | Multiple components | High |
| 4.2 | Phaser event listeners never cleaned up | `zone-card.ts` | High |
| 4.3 | `GameService` self-subscription leak | `game.service.ts` | Low |
| 5.1 | `removeDeck` filter uses `===` instead of `!==` | `player.ts` | High |
| 5.2 | Card identity uses reference equality | `deck.ts` | Medium |
| 5.3 | Throwing strings instead of `Error` objects | `deck.ts` | Low |
| 5.4 | `==` used for socket ID comparisons | `duelist.ts` | Low |
| 6.1 | `getGames` broadcasts to all clients | `games.gateway.ts` | Medium |
| 6.2 | Duplicate users via array push | `games.gateway.ts` | High |
| 6.3 | No in-memory game cleanup | `games.gateway.ts` | Medium |
| 6.4 | No input validation in gateway handlers | All gateways | Medium |
| 7.1 | `SocketPayloadInterface.data` typed as `any` | Both interfaces | Medium |
| 8.1 | Nested `setTimeout` callback hell | `duelist.ts` | Medium |
| 8.2 | `_.values()` instead of `Object.values()` | `games.gateway.ts` | Low |
| 8.3 | Magic numbers in game engine | Multiple | Low |
| 8.4 | Debug `console.log` in production code | Multiple | Low |
