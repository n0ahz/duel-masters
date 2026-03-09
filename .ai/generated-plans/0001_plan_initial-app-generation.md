# Plan 0001: Initial App Generation — Duel Masters Web Game

## Description

Build a full MEAN-stack web game implementation of the **Duel Masters** Trading Card Game. The stack is:

- **Frontend**: Angular 19 (latest stable), Angular Material 19, Phaser 3 (game engine), ngx-socket-io
- **Backend**: NestJS 11 with Express, Socket.io WebSockets
- **Database**: MongoDB 7 via Mongoose (not TypeORM — use `@nestjs/mongoose`)
- **Shared**: `@dm/shared` local package with typed contracts (interfaces, enums, constants) used by both sides

Reference implementation lives in `dm-backend/` and `dm-frontend/` (archived). New code goes into `backend/`, `frontend/`, `shared/`. Card data source: `data/DuelMastersCards.json`.

> **Game Rules Reference**: During implementation, use websearch to look up game rules and mechanics from the Duel Masters fandom wiki:
> - https://duelmasters.fandom.com/wiki/Duel_Masters_(Card_Game)
> - https://duelmasters.fandom.com/wiki/Rule
> - https://duelmasters.fandom.com/wiki/How_to_Play/Basic
> - https://duelmasters.fandom.com/wiki/How_to_Play/Advanced
> - https://duelmasters.fandom.com/wiki/Category:Gameplay

### Persistence Requirements

All meaningful game data must be saved to MongoDB — not only in-memory:
- **Users**: created/updated on every Google OAuth sign-in
- **Games**: game document created in MongoDB when a room is created in the lobby; updated through each status transition (waiting → in-progress → completed)
- **Moves/Steps**: every socket-driven game action (`CARD_DROP`, `TAP_CARD`, `UNTAP_CARD`, phase changes) is appended to the game's `moves[]` array in real-time
- **Chat**: every `SEND_CHAT` message is persisted to the `ChatMessage` collection before being broadcast

---

## Phase 1 — Shared Package (`shared/`)

Establish the typed contract layer first; both backend and frontend depend on it.

### Files to Create

| File | Purpose |
|---|---|
| `shared/package.json` | Package name `@dm/shared`, `main: "index.ts"`, no build step (path alias) |
| `shared/index.ts` | Barrel export of all enums, interfaces, constants |
| `shared/constants/game.constants.ts` | `GAME_CONSTANTS`: deck max 40, shields 5, initial hand 5, world dimensions 2000×960 |
| `shared/constants/game-timings.ts` | Animation/delay durations used by Phaser scenes |
| `shared/constants/game-layout.ts` | Zone positions, card dimensions, layout grid |
| `shared/enums/game.enum.ts` | `GameStatus` (waiting, in-progress, completed), `GameType` |
| `shared/enums/card.enum.ts` | `Civilization` (Light, Water, Darkness, Fire, Nature), `CardType` (Creature, Spell, CrossGear), `Rarity`, `CardSet` (DM-01…DM-17) |
| `shared/enums/zone.enum.ts` | `ZoneType` (deck, hand, shields, battle-zone, graveyard, mana), `ZoneVisibility`, `ZoneSpacing`, `PlayerSide`, `Position` |
| `shared/enums/phase.enum.ts` | `Phase` (start, draw, charge, main, attack, block, end) |
| `shared/enums/gateway/game-commands.enum.ts` | Client→server events: `CREATE_GAME`, `LIST_GAMES`, `JOIN_GAME`, `LEAVE_GAME`, `CHALLENGE`, `COIN_TOSS_PICK`, `COIN_TOSS_FLIP`, `DECIDE_WHO_GOES_FIRST`, `CARD_DROP`, `TAP_CARD`, `UNTAP_CARD`, `SEND_CHAT` |
| `shared/enums/gateway/game-events.enum.ts` | Server→client events: `GAME_CREATED`, `GAMES_LIST`, `GAME_JOINED`, `GAME_LEFT`, `CHALLENGED`, `COIN_TOSS_RESULT`, `DUEL_STARTED`, `GAME_STATE_UPDATE`, `CARD_DROPPED`, `CARD_TAPPED`, `CHAT_MESSAGE`, `ERROR` |
| `shared/interfaces/card.interface.ts` | `CardInterface`: name, civilizations, cost, power, type, subtypes, supertypes, text, printings |
| `shared/interfaces/zone-card.interface.ts` | `ZoneCardInterface<T>`: id, card, zone, position, isTapped, isRevealed, ownerId |
| `shared/interfaces/game.interface.ts` | `GameInterface`: id, name, inviterId, challengerId, status, type, createdAt |
| `shared/interfaces/socket-payload.interface.ts` | `SocketPayloadInterface<T>`: event, data, gameId, userId |
| `shared/interfaces/game-state.interface.ts` | `GameStateInterface`: gameId, players (Map), currentPhase, turn, shields, battleZone, graveyard, mana |
| `shared/interfaces/chat-message.interface.ts` | `ChatMessageInterface`: gameId, userId, username, message, timestamp |

---

## Phase 2A — Backend (`backend/`)

### Bootstrap

| File | Purpose |
|---|---|
| `backend/package.json` | NestJS 11, `@nestjs/mongoose`, `mongoose`, `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`, `bcrypt`, `passport`, `@nestjs/passport`, `passport-google-oauth20` |
| `backend/tsconfig.json` | Extends NestJS defaults; path alias `@dm/shared` → `../shared/index.ts` |
| `backend/nest-cli.json` | Standard NestJS config |
| `backend/.env.example` | `PORT=3000`, `MONGODB_URI=mongodb://localhost:27017/duel-masters`, `CORS_ORIGIN=http://localhost:4200`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| `backend/src/main.ts` | Bootstrap with CORS, Socket.io adapter, `.env` via `@nestjs/config` |
| `backend/src/app.module.ts` | Root module: imports ConfigModule, MongooseModule, all feature modules |

### Mongoose Schemas (in respective modules)

| File | Schema / Collection |
|---|---|
| `backend/src/modules/cards/schemas/card.schema.ts` | `Card` collection: all fields from `data/schema.json` — name, civilizations[], cost, power, type, subtypes[], supertypes[], text, printings[] (set, id, rarity, illustrator, flavor) |
| `backend/src/modules/users/schemas/user.schema.ts` | `User` collection: googleId, email, displayName, avatarUrl, createdAt, updatedAt |
| `backend/src/modules/games/schemas/game.schema.ts` | `Game` collection: name, inviterId, challengerId, status (`GameStatus`), type, createdAt, startedAt, endedAt, winnerId. This is the **authoritative DB record** for the game lifecycle (lobby through completion). |
| `backend/src/modules/games/schemas/move.schema.ts` | Embedded sub-schema for a single game move/step: playerId, type (card-drop, tap, untap, phase-change, shield-break), payload (serialized zone-card or phase info), timestamp |
| `backend/src/modules/games/schemas/game-step.schema.ts` | `GameStep` collection (separate from `Game` for write performance): gameId (ref), move sub-doc, sequenceNumber. Appended on every socket action. |
| `backend/src/modules/chat/schemas/chat-message.schema.ts` | `ChatMessage` collection: gameId (ref `Game`), userId (ref `User`), username, message, timestamp |

### Modules

**CardsModule** (`backend/src/modules/cards/`)

| File | Purpose |
|---|---|
| `cards.module.ts` | MongooseModule.forFeature([Card]), CardsService, CardsController |
| `cards.service.ts` | `findAll(filters)`, `findById(id)`, `findByCivilization(civ)`, `search(query)` |
| `cards.controller.ts` | `GET /cards`, `GET /cards/:id` — REST endpoints for card browsing UI |

**UsersModule** (`backend/src/modules/users/`)

| File | Purpose |
|---|---|
| `users.module.ts` | MongooseModule.forFeature([User]), UsersService |
| `users.service.ts` | `findOrCreate(googleProfile)`, `findById(id)`, `findByGoogleId(googleId)` |

**GamesModule** (`backend/src/modules/games/`)

| File | Purpose |
|---|---|
| `games.module.ts` | MongooseModule.forFeature([Game, GameStep]), GamesService, GamesController |
| `games.service.ts` | `createGame(data)` → inserts `Game` doc on lobby creation; `startGame(gameId)` → sets status=in-progress, startedAt; `recordStep(gameId, move)` → appends `GameStep` doc in real-time for every socket action; `endGame(gameId, winnerId)` → sets status=completed, endedAt; `findByUser(userId)`, `findById(gameId)` |
| `games.controller.ts` | `GET /games` (user's game history), `GET /games/:id` (game detail with steps) |

**AuthModule** (`backend/src/modules/auth/`)

| File | Purpose |
|---|---|
| `auth.module.ts` | PassportModule, Google OAuth strategy, UsersModule |
| `auth.service.ts` | `validateGoogleUser(profile)` → UsersService.findOrCreate |
| `google.strategy.ts` | `passport-google-oauth20` strategy; callback upserts user, returns user object |
| `auth.controller.ts` | `GET /auth/google`, `GET /auth/google/callback` — redirect flow |
| `ws-jwt.guard.ts` | WebSocket guard; validates socket handshake auth token |

### In-Memory Services

| File | Purpose |
|---|---|
| `backend/src/services/game-room.service.ts` | `Map<gameId, GameRoomState>` — active game rooms; CRUD for lobby (create, get, list, delete); cleanup interval for stale rooms |
| `backend/src/services/duel-state.service.ts` | Manages per-game in-memory duel state: shuffle deck, draw cards, tap/untap, advance phase, shield damage, win condition check |
| `backend/src/services/coin-toss.service.ts` | Stores per-game coin picks, flips coin (Math.random), resolves winner |

### WebSocket Gateways

All gateways are in `backend/src/gateway/`. Event names come from `@dm/shared` enums. Each gateway emits errors via `GameEvents.ERROR`.

| File | Events handled |
|---|---|
| `main.gateway.ts` | `connection`, `disconnect` — set socket.data.userId from auth, update active-users map |
| `games.gateway.ts` | Commands: `CREATE_GAME` → GameRoomService (in-memory) + `GamesService.createGame()` (MongoDB); `LIST_GAMES`, `JOIN_GAME`, `LEAVE_GAME`, `CHALLENGE`; on `DUEL_STARTED` calls `GamesService.startGame()` |
| `duel.gateway.ts` | Commands: `CARD_DROP`, `TAP_CARD`, `UNTAP_CARD`, phase transitions; uses DuelStateService (in-memory); calls `GamesService.recordStep()` on every action before broadcasting state |
| `duel-decision.gateway.ts` | Commands: `COIN_TOSS_PICK`, `COIN_TOSS_FLIP`, `DECIDE_WHO_GOES_FIRST`; uses CoinTossService; records coin-toss steps via `GamesService.recordStep()` |
| `chat.gateway.ts` | Commands: `SEND_CHAT`; persists `ChatMessage` to MongoDB **before** broadcasting to room |

### Seed Script

| File | Purpose |
|---|---|
| `backend/src/scripts/seed-cards.ts` | Reads `../../data/DuelMastersCards.json`, maps each entry to Card schema shape, uses `bulkWrite` with `upsert` on `name + set + id`. Run via `npm run seed`. |
| `backend/package.json` (script) | `"seed": "ts-node -r tsconfig-paths/register src/scripts/seed-cards.ts"` |

---

## Phase 2B — Frontend (`frontend/`)

### Bootstrap

| File | Purpose |
|---|---|
| `frontend/package.json` | Angular 19, `@angular/material` 19, `phaser` ^3.80, `ngx-socket-io`, `@abacritt/angularx-social-login` |
| `frontend/tsconfig.json` | Path alias `@dm/shared` → `../../shared/index.ts` |
| `frontend/angular.json` | Configure assets, styles (Angular Material theme), budgets |
| `frontend/src/main.ts` | `bootstrapApplication(AppComponent, appConfig)` (standalone) |
| `frontend/src/app/app.config.ts` | `provideRouter`, `provideAnimations`, `provideHttpClient`, Socket.io config (`http://localhost:3000`), Google OAuth client ID |
| `frontend/src/app/app.component.ts` | Root component: router outlet + Material toolbar |
| `frontend/src/app/app.routes.ts` | Lazy routes: `/` → LobbyModule, `/game/:id` → GameViewModule, `/duel/:id` → DuelModule, `/cards` → CardBrowserModule |

### Core Services (`frontend/src/app/core/services/`)

| File | Purpose |
|---|---|
| `socket.service.ts` | Thin Observable wrapper over ngx-socket-io; `emit<T>(event, payload)`, `on<T>(event): Observable<T>` |
| `game.service.ts` | `BehaviorSubject<GameInterface[]>` for lobby list; `BehaviorSubject<GameStateInterface>` for active game state; listens to socket events, updates subjects |
| `auth.service.ts` | Google OAuth via `@abacritt/angularx-social-login`; stores user token; `currentUser$: BehaviorSubject<User>` |
| `error.service.ts` | Listens to `GameEvents.ERROR` from socket; surfaces via `MatSnackBar` |
| `duel-engine.service.ts` | Creates and manages Phaser `Game` instance; injects into DOM element; proxies socket events into/out-of Phaser scenes |

### Feature Modules (all standalone components, lazy loaded)

**LobbyModule** (`frontend/src/app/features/lobby/`)

| File | Purpose |
|---|---|
| `lobby.component.ts` | Lists available games via `game.service.ts`; buttons: Create Game, Join Game |
| `lobby.component.html` | `mat-table` with game rows; `mat-fab` create button |
| `create-game-dialog.component.ts` | `MatDialog` form: game name, type; emits `CREATE_GAME` on submit |
| `lobby.routes.ts` | Default route |

**GameViewModule** (`frontend/src/app/features/game-view/`)

| File | Purpose |
|---|---|
| `game-view.component.ts` | Waiting room / pre-duel flow: coin toss, who-goes-first decision; transitions to `/duel/:id` on `DUEL_STARTED` |
| `coin-toss.component.ts` | UI for picking heads/tails; emits `COIN_TOSS_PICK`, then `COIN_TOSS_FLIP`; displays result |
| `duel-decision.component.ts` | UI for winner to decide who goes first; emits `DECIDE_WHO_GOES_FIRST` |

**DuelModule** (`frontend/src/app/features/duel/`)

| File | Purpose |
|---|---|
| `duel.component.ts` | Hosts Phaser canvas via `DuelEngineService`; subscribes to socket events and forwards to Phaser; also hosts chat panel |
| `chat.component.ts` | Chat input + history list; emits `SEND_CHAT`, listens to `CHAT_MESSAGE` |
| `duel.routes.ts` | Route for `/duel/:id` |

**CardBrowserModule** (`frontend/src/app/features/cards/`)

| File | Purpose |
|---|---|
| `card-browser.component.ts` | `GET /cards` via HttpClient with filters (civilization, type, set, search); `mat-grid-list` of card thumbnails |
| `card-detail-dialog.component.ts` | `MatDialog` showing full card info |

### Phaser Game Engine (`frontend/src/app/game-engine/`)

| File | Purpose |
|---|---|
| `scenes/boot.scene.ts` | Loads fonts, minimal config |
| `scenes/preload.scene.ts` | Loads card images (placeholder textures if no asset), zone background images |
| `scenes/duel.scene.ts` | Main game scene; creates player zones, handles `create()`, `update()` loop; receives socket events via `DuelEngineService` event bus |
| `card.ts` | Phaser `GameObject` for a card: face-up/down, tap animation, drag support |
| `zone.ts` | `ZoneCard` data model + Phaser container for a game zone (deck, hand, shields, etc.) |
| `player.ts` | Represents a player's board state in Phaser |
| `duel-zone.ts` | Orchestrates all player zones on both sides of the board; handles card placement, spacing |
| `factories/civilization.factory.ts` | Maps `Civilization` enum → card frame tint color |
| `factories/phase.factory.ts` | Maps `Phase` enum → allowed actions |

---

## Phase 3 — Docker

| File | Purpose |
|---|---|
| `docker-compose.dev.yaml` | Three services: `mongodb` (mongo:7, port 27017, named volume `mongo-data`), `backend` (Dockerfile.dev with `npm run start:dev`, volume-mount `./backend:/app`, port 3000), `frontend` (Dockerfile.dev with `npm start`, volume-mount `./frontend:/app`, port 4200). All three on `dm-network`. |
| `backend/Dockerfile.dev` | `FROM node:20-alpine`, WORKDIR `/app`, COPY package.json, `npm install`, CMD `npm run start:dev` |
| `frontend/Dockerfile.dev` | `FROM node:20-alpine`, WORKDIR `/app`, COPY package.json, `npm install`, CMD `npm start -- --host 0.0.0.0` |
| `.env` | Actual env values (gitignored) |
| `.env.example` | Template copied to both root and `backend/` |

---

## Implementation Notes

### Card Seed Algorithm
1. Read `data/DuelMastersCards.json` → parse `cards[]` array
2. For each card, map printings array → keep all printing objects as-is
3. `BulkWrite` with `updateOne({ name, "printings.0.set": printing.set, "printings.0.id": printing.id }, { $setOnInsert: cardDoc }, { upsert: true })`
4. Log inserted vs skipped counts

### Game State Flow (in-memory + DB-persisted)
1. `CREATE_GAME` → GameRoomService creates in-memory room → **GamesService.createGame()** inserts `Game` doc (status=waiting) → `GAME_CREATED` broadcast
2. `JOIN_GAME` → player joins Socket.io room → `GAME_JOINED` to inviter
3. `CHALLENGE` → challenger sends challenge → `CHALLENGED` emitted → coin toss begins
4. `COIN_TOSS_PICK` (×2 players) + `COIN_TOSS_FLIP` → **GamesService.recordStep()** appends coin-toss steps → `COIN_TOSS_RESULT` broadcast
5. `DECIDE_WHO_GOES_FIRST` → **GamesService.startGame()** sets status=in-progress, startedAt → DuelStateService initializes in-memory game state (shuffle decks, deal shields, draw 5) → **GamesService.recordStep()** records initial deal → `DUEL_STARTED` broadcast with initial `GameStateInterface`
6. `CARD_DROP` / `TAP_CARD` / phase change → DuelStateService mutates in-memory state → **GamesService.recordStep()** appends move doc → `GAME_STATE_UPDATE` broadcast to room
7. Win condition met → **GamesService.endGame(gameId, winnerId)** sets status=completed, endedAt → `GAME_ENDED` broadcast
8. `SEND_CHAT` → **ChatMessage** inserted to MongoDB → `CHAT_MESSAGE` broadcast to room

### Path Aliases
Both `backend/tsconfig.json` and `frontend/tsconfig.json` must include:
```
"paths": { "@dm/shared": ["../shared/index.ts"] }
```
`backend/package.json` needs `tsconfig-paths` for the seed script.
