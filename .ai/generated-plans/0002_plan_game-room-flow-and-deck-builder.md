# Plan: Game Room Flow & Deck Builder

## Overview

This plan covers two interconnected features:

1. **Game Room page** — after a game is created, both players interact in a structured room with game info, a real-time chat, and a right-panel that progresses through phases: waiting → coin toss → decide who goes first → deck selection → duel start.
2. **Deck Builder** — users create and manage decks (max 40 cards, max 4 copies per card). Before a duel starts, each player selects their deck (or auto-selects if only one exists).

---

## Phase 1 — Data & Contract Layer

### 1.1 Shared Contracts (`shared/`)

**New interfaces:**

- `shared/interfaces/chat-message.interface.ts`
  - `{ gameId, senderId, senderName, message, timestamp, isLog: boolean }`
  - `isLog: true` for system messages (user joined/left); `false` for chat messages.

- `shared/interfaces/deck.interface.ts`
  - `{ _id?, userId, name, cards: { cardId: string; copies: number }[] }`
  - Mirrors the Deck Mongoose schema.

**New shared enums** — add to existing enum files:

- `shared/enums/gateway/game-commands.enum.ts`:
  - `SEND_CHAT = 'send_chat'` ← already exists, **no change needed**
  - `CREATE_DECK = 'create_deck'`
  - `GET_DECKS = 'get_decks'`
  - `DELETE_DECK = 'delete_deck'`
  - `SUBMIT_DECK = 'submit_deck'` ← new; each player submits their chosen deckId before game starts

- `shared/enums/gateway/game-events.enum.ts`:
  - `CHAT_MESSAGE = 'chat_message'` ← already exists, **no change needed**
  - `PLAYER_JOINED_ROOM = 'player_joined_room'` ← new; log event when player enters room
  - `PLAYER_LEFT_ROOM = 'player_left_room'` ← new; log event when player leaves room
  - `DECKS_LIST = 'decks_list'`
  - `DECK_CREATED = 'deck_created'`
  - `DECK_DELETED = 'deck_deleted'`
  - `DECK_SUBMITTED = 'deck_submitted'` ← broadcast to room when a player locks in their deck
  - Note: `DUEL_STARTED` already exists; backend emits it when both decks submitted + order decided.

**Update `shared/index.ts`** to export all new interfaces and enum values.

### 1.2 Backend — Deck Module (`backend/src/modules/decks/`)

**New files:**

- `schemas/deck.schema.ts`
  ```
  @Schema({ timestamps: true })
  Deck {
    userId: string          // owner
    name: string
    cards: [{ cardId: string; copies: number }]   // cardId = Card._id string
  }
  ```
  - No hard validation in schema; enforce max-40/max-4 in `DecksService`.

- `decks.service.ts` — methods:
  - `createDeck(userId, name, cards)` → validates total copies ≤ 40, each card copies ≤ 4, then saves.
  - `getUserDecks(userId)` → returns all decks for user.
  - `getDeck(deckId)` → single deck lookup.
  - `deleteDeck(deckId, userId)` → validates ownership before delete.
  - `expandDeck(deckId)` → resolves full `CardInterface[]` array by joining with Card model (needed to pass to `DuelStateService.initGame()`).

- `decks.module.ts` — imports `MongooseModule.forFeature([Deck, Card])`, exports `DecksService`.
  - Register `DecksModule` in `backend/src/app.module.ts`.

### 1.3 Backend — Deck Selection State in DuelDecisionGateway

Add a `deckSubmissions: Map<gameId, Map<userId, deckId>>` in-memory structure (can live in `GameRoomService` or a new `DeckReadyService`). After both players submit a deck AND the order has been decided, the gateway calls `DuelStateService.initGame()` and emits `DUEL_STARTED`.

Specifically, track two conditions per gameId:
- `orderDecided: { firstPlayerId }` — set when `DECIDE_WHO_GOES_FIRST` is received.
- `deckSubmissions: Map<userId, deckId>` — updated on each `SUBMIT_DECK`.

When both players' decks are received **and** order is decided → trigger duel start.

---

## Phase 2A — Backend Changes

### 2A.1 `GamesGateway` (`backend/src/gateway/games.gateway.ts`)

- **Add** `@SubscribeMessage(GameCommands.SEND_CHAT)` handler — `handleSendChat(data, socket)`:
  - Payload: `{ gameId, message }`
  - Validate socket is in the game room.
  - Broadcast `GameEvents.CHAT_MESSAGE` to room: `{ gameId, senderId, senderName, message, timestamp, isLog: false }`.

- **Modify** `handleJoinGame` — after joining, broadcast `GameEvents.PLAYER_JOINED_ROOM` to room:
  - `{ gameId, userId, username, timestamp }` (used as a chat log entry with `isLog: true`).

- **Modify** `handleLeaveGame` — broadcast `GameEvents.PLAYER_LEFT_ROOM` similarly.

### 2A.2 New `DecksGateway` (`backend/src/gateway/decks.gateway.ts`)

- `@SubscribeMessage(GameCommands.GET_DECKS)` → calls `decksService.getUserDecks(socket.data.userId)`, emits `DECKS_LIST`.
- `@SubscribeMessage(GameCommands.CREATE_DECK)` → calls `decksService.createDeck(...)`, emits `DECK_CREATED`.
- `@SubscribeMessage(GameCommands.DELETE_DECK)` → calls `decksService.deleteDeck(...)`, emits `DECK_DELETED` or `ERROR`.
- Register `DecksGateway` in `DecksModule`.

### 2A.3 `DuelDecisionGateway` (`backend/src/gateway/duel-decision.gateway.ts`)

- **Add** `@SubscribeMessage(GameCommands.SUBMIT_DECK)` handler:
  - Payload: `{ gameId, deckId }`
  - Records the player's deck submission in the in-memory tracking structure.
  - Broadcasts `GameEvents.DECK_SUBMITTED` to room: `{ gameId, userId, deckId }`.
  - Calls `checkAndStartDuel(gameId)` (private helper).

- **Modify** `handleDecideFirst` (`DECIDE_WHO_GOES_FIRST`):
  - Records the order decision.
  - Calls `checkAndStartDuel(gameId)`.
  - **Remove** the current direct call to `DuelStateService.initGame()` and `emitting DUEL_STARTED` from here — that now lives in `checkAndStartDuel`.

- **New private `checkAndStartDuel(gameId)`**:
  1. Check if both players have submitted decks AND order is decided.
  2. If yes: call `decksService.expandDeck()` for each player to get full card arrays.
  3. Call `duelStateService.initGame(gameId, [{userId, username, deck},...])`.
  4. Call `gamesService.startGame(dbId)`.
  5. Record a `duel_started` GameStep.
  6. Emit `GameEvents.DUEL_STARTED` to room: `{ gameId, firstPlayerId }`.

- **Inject** `DecksService` into `DuelDecisionGateway`.

---

## Phase 2B — Frontend Changes

### 2B.1 Refactor `GameViewComponent` (`frontend/src/app/features/game-view/game-view.component.ts`)

Current: single-panel layout with coin toss and decide phases.

New layout — two-column split:
- **Left column** (fixed ~320px):
  - **Top panel** — `GameInfoPanelComponent` (inline or extracted):
    - Shows: game name, status badge, inviter name, challenger name (or "Waiting…").
    - Updates reactively as socket events arrive (CHALLENGED updates challenger name).
  - **Bottom panel** — `ChatPanelComponent` (inline or extracted):
    - Scrollable message list — both chat messages (`isLog: false`) and system logs (`isLog: true`, styled differently).
    - Shows connected players list above messages.
    - Text input + send button to emit `SEND_CHAT`.
    - Subscribes to: `CHAT_MESSAGE`, `PLAYER_JOINED_ROOM`, `PLAYER_LEFT_ROOM`.
    - Auto-scrolls to bottom on new message.
- **Right column** (flex-grow):
  - Existing phase panels: `waiting`, `coin-toss`, `decide` (no structural change).
  - **New phase** `deck-select`: shown after coin toss result and order decision.

**New `GameViewPhase` value**: add `'deck-select'` to the existing `type GameViewPhase`.

**Phase transition update** in `ngOnInit()`:
- `CHALLENGED` → `'coin-toss'` ← no change
- `COIN_TOSS_RESULT` → remains in `'coin-toss'` (shows result, winner picks order)
- After `DECIDE_WHO_GOES_FIRST` emitted → transition to `'deck-select'`
- `DUEL_STARTED` → navigate to `/duel/:gameId` ← no change

**New subscriptions** in `ngOnInit()`:
- `CHAT_MESSAGE` → push to `messages: ChatMessageInterface[]` array.
- `PLAYER_JOINED_ROOM` / `PLAYER_LEFT_ROOM` → push as `isLog: true` entries to same `messages` array.
- `DECK_SUBMITTED` → mark the submitting player as "deck locked" in UI.
- `DECKS_LIST` → populate `availableDecks: DeckInterface[]`.

**New methods:**
- `sendChat()` → emit `SEND_CHAT` with `{ gameId, message }`, clear input.
- `submitDeck(deckId)` → emit `SUBMIT_DECK` with `{ gameId, deckId }`, set `deckSubmitted = true`.
- `loadDecks()` → emit `GET_DECKS` on entering `deck-select` phase; called when phase transitions.

**Deck-select panel template**:
- If `availableDecks.length === 1` → auto-submit on panel mount (call `submitDeck` in phase transition logic).
- If `availableDecks.length > 1` → show list of deck cards (name, card count); clicking one calls `submitDeck(deck._id)`.
- If `availableDecks.length === 0` → show "No decks found. Create a deck first." with link to `/decks`.
- After player submits, show "Waiting for opponent to select their deck…" with spinner.
- Show opponent's locked-in indicator when `DECK_SUBMITTED` received for the other player.

### 2B.2 New Route + `DeckBuilderComponent` (`frontend/src/app/features/decks/`)

**Route**: `/decks` in `app.routes.ts`.

**`DeckListComponent`** — default view at `/decks`:
- Shows user's decks via `GET_DECKS`.
- "Create New Deck" button → opens `DeckBuilderComponent` (same route, sub-view or `/decks/new`).
- Delete button per deck (with confirmation).

**`DeckBuilderComponent`** — view at `/decks/new` or `/decks/:deckId`:
- Card browser on the right: paginated/searchable card list (uses existing card data from `GET /cards` or socket if available).
- Deck canvas on the left: shows added cards, grouped by civilization, with copy count badges.
- Constraints enforced in UI: disable "add" when card already has 4 copies or deck is at 40 total.
- Card count indicator: `X / 40` cards.
- "Save Deck" → emits `CREATE_DECK` with `{ name, cards: [{cardId, copies}] }`.

### 2B.3 `GameService` (`frontend/src/app/core/services/game.service.ts`)

- Add `decks$: BehaviorSubject<DeckInterface[]>` for storing user's deck list.
- Subscribe to `DECKS_LIST` → update `decks$`.
- Subscribe to `DECK_CREATED` → append to `decks$`.
- Subscribe to `DECK_DELETED` → filter from `decks$`.

### 2B.4 Navigation

- Add "DECKS" nav link to `app.component.ts` navbar alongside existing LOBBY and CARDS links.

---

## Affected Files Summary

| File | Action |
|------|--------|
| `shared/interfaces/chat-message.interface.ts` | Create |
| `shared/interfaces/deck.interface.ts` | Create |
| `shared/enums/gateway/game-commands.enum.ts` | Add `CREATE_DECK`, `GET_DECKS`, `DELETE_DECK`, `SUBMIT_DECK` |
| `shared/enums/gateway/game-events.enum.ts` | Add `PLAYER_JOINED_ROOM`, `PLAYER_LEFT_ROOM`, `DECKS_LIST`, `DECK_CREATED`, `DECK_DELETED`, `DECK_SUBMITTED` |
| `shared/index.ts` | Export new types |
| `backend/src/modules/decks/schemas/deck.schema.ts` | Create |
| `backend/src/modules/decks/decks.service.ts` | Create |
| `backend/src/modules/decks/decks.module.ts` | Create |
| `backend/src/gateway/decks.gateway.ts` | Create |
| `backend/src/app.module.ts` | Register DecksModule |
| `backend/src/gateway/games.gateway.ts` | Add `SEND_CHAT` handler; emit `PLAYER_JOINED_ROOM` / `PLAYER_LEFT_ROOM` in join/leave |
| `backend/src/gateway/duel-decision.gateway.ts` | Add `SUBMIT_DECK` handler; refactor `handleDecideFirst` to use `checkAndStartDuel` |
| `frontend/src/app/features/game-view/game-view.component.ts` | Full refactor — two-column layout, chat panel, deck-select phase |
| `frontend/src/app/features/decks/deck-list.component.ts` | Create |
| `frontend/src/app/features/decks/deck-builder.component.ts` | Create |
| `frontend/src/app/core/services/game.service.ts` | Add `decks$`, subscribe to deck events |
| `frontend/src/app/app.routes.ts` | Add `/decks` route |
| `frontend/src/app/app.component.ts` | Add DECKS nav link |
