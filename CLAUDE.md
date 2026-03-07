# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Duel-Masters is a web-based multiplayer implementation of the Duel Masters Trading Card Game (OCG/TCG). It uses Angular + Phaser 3 on the frontend and NestJS + Socket.io on the backend for real-time gameplay.

## Commands

### Backend (`dm-backend/`)
```bash
npm run start:dev    # Run with watch mode (development)
npm run build        # Production build
npm run lint         # ESLint with auto-fix
npm run test         # Jest unit tests
npm run test:watch   # Jest in watch mode
npm run test:e2e     # End-to-end tests
```

### Frontend (`dm-frontend/`)
```bash
npm start            # ng serve on http://localhost:4200
npm run build        # Production build
npm run test         # Karma unit tests
npm run lint         # ESLint
```

## Architecture

### Communication Layer
Frontend and backend communicate exclusively via Socket.io WebSockets. The frontend connects to `http://localhost:3000` (configured in `app.module.ts`). There are no REST API calls — all game state changes flow through WebSocket events.

Event names are defined as enums mirrored on both sides:
- Backend: `dm-backend/src/enums/gateway/`
- Frontend: `dm-frontend/src/app/enums/gateway/`

### Backend Gateways
Four NestJS WebSocket gateways handle distinct concerns:
- **MainGateway** (`main.gateway.ts`): Connection/disconnection lifecycle
- **GamesGateway** (`games.gateway.ts`): Lobby — create, list, join, leave, challenge games
- **DuelGateway** (`duel.gateway.ts`): In-game actions — card drop, tap/untap
- **DuelDecisionGateway** (`duel-decision.gateway.ts`): Coin toss and who-goes-first decisions

Game state is stored **in-memory** in a `gameRooms` object on the backend (TypeORM/MongoDB is configured but not yet used for game state).

### Frontend Architecture
- **SocketService** (`services/socket.service.ts`): Thin wrapper around ngx-socket-io
- **GameService** (`services/game.service.ts`): Holds current game state as RxJS `BehaviorSubject`
- **DuelService** (`services/duel.service.ts`): Creates and manages the Phaser game instance
- **game-engine/**: All Phaser 3 game logic — scenes, cards, zones, players
  - `duel-zone.ts` and `zone-card.ts` are the largest files (~5k–8k lines), containing the bulk of game mechanics

### Game Lifecycle
1. **Lobby** → user creates/joins a game room
2. **Waiting** → inviter waits for a challenger
3. **Challenge** → challenger joins and sends challenge event
4. **Coin Toss** → both players pick coin side; one flips
5. **Duel Decision** → coin winner decides who goes first
6. **In Progress** → Phaser scene takes over for real-time card play
7. **Completed** → game ends

### Key Interfaces
- `GameInterface` (`interfaces/game.interface.ts`): name, inviter, challenger, gameStatus, gameType
- `CardInterface` / `ZoneCardInterface`: Card data and zone placement

### Authentication
Google OAuth via `@abacritt/angularx-social-login`. Client ID is configured in `app.module.ts`.

## Tech Stack
- **Frontend**: Angular 19, Angular Material 18, Phaser 3, ngx-socket-io, TypeScript 5.8
- **Backend**: NestJS 11, Socket.io, TypeORM, MongoDB (not yet active for game state), TypeScript 4
- **Testing**: Jest (backend), Karma/Jasmine (frontend)
