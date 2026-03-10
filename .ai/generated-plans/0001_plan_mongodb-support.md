# Plan: MongoDB Support

## Context

Add full MongoDB persistence to `dm-backend/` using `@nestjs/mongoose` (replacing the unused TypeORM v0.2 + mongodb v3.7 stubs). The backend currently stores all game state in-memory only. This plan covers:

1. **Users** — stored in MongoDB with Google OAuth or admin username/password login
2. **Cards** — migrated from `data/DuelMastersCards.json` into a `cards` collection
3. **Decks** — user-owned, max 40 cards, max 4 copies of any single card
4. **Game history** — every game created, every in-game action/chat/move persisted as `GameStep` documents

Auth uses Passport.js: Google OAuth for regular users, Local strategy for the admin, JWT for session tokens on protected REST endpoints.

---

## Phase 1 — Data Layer (Schemas + DB wiring)

### New packages (`dm-backend/`)

Remove: `@nestjs/typeorm`, `typeorm`, `mongodb`
Add (dependencies): `@nestjs/mongoose`, `mongoose`, `@nestjs/passport`, `passport`, `passport-google-oauth20`, `passport-local`, `@nestjs/jwt`, `passport-jwt`, `bcrypt`, `class-validator`, `class-transformer`
Add (devDependencies): `@types/passport-google-oauth20`, `@types/passport-local`, `@types/passport-jwt`, `@types/bcrypt`

### Files to create

#### `dm-backend/src/schemas/user.schema.ts`
Mongoose schema — fields:
- `googleId?: string` — populated on Google OAuth login
- `email: string` (unique, required)
- `username: string` (unique, required)
- `passwordHash?: string` — only set for the admin account
- `isAdmin: boolean` (default `false`)
- `createdAt: Date` (default `Date.now`)

#### `dm-backend/src/schemas/card.schema.ts`
Mongoose schema matching `data/schema.json`. Fields:
- `name: string` (required, indexed)
- `civilizations: string[]` — values: `Light | Water | Darkness | Fire | Nature`
- `type: string` — `Creature | Spell | Cross Gear`
- `cost: number`
- `power?: string` — kept as string per source data (e.g. `"3000+"`)
- `text?: string`
- `subtypes?: string[]`
- `supertypes?: string[]` — e.g. `['Evolution']`
- `printings: [{ set: string, id: string, rarity: string, illustrator: string, flavor?: string }]`

One document per unique card name. A card with multiple printings stores all printings in the `printings` array.

#### `dm-backend/src/schemas/deck.schema.ts`
Mongoose schema — fields:
- `owner: ObjectId` (ref `User`, required)
- `name: string` (required)
- `cards: [{ card: ObjectId (ref Card), count: number }]`
- `createdAt: Date`
- `updatedAt: Date`

Deck validation rules (enforced in service layer, not schema):
- Total cards = sum of all `count` values ≤ 40 (`DECK.MAX_CARDS_PER_DECK` from `@dm/shared`)
- Each individual card's `count` ≤ 4

#### `dm-backend/src/schemas/game.schema.ts`
Persistent game record — fields:
- `gameIdentifier: string` (unique, indexed — same value used in socket rooms)
- `name: string`
- `inviter: string` (socket ID at creation; later linked to User)
- `challenger?: string`
- `gameType: string`
- `status: string` — mirrors `GameStatusEnum`
- `firstToGo?: string`
- `createdAt: Date`
- `endedAt?: Date`

#### `dm-backend/src/schemas/game-step.schema.ts`
One document per in-game action — fields:
- `game: ObjectId` (ref `Game`, required, indexed)
- `type: string` — `'chat' | 'move' | 'action'`
- `actor: string` (socket ID)
- `event: string` — the socket event name (e.g. `dropCards`, `tapUntapCard`, `msgToClient`)
- `payload: Object` (raw event payload stored as Mixed)
- `timestamp: Date` (default `Date.now`)

### Files to modify

#### `dm-backend/package.json`
- Update dependency list as described above
- Add `"seed": "ts-node -r tsconfig-paths/register src/seeds/cards.seed.ts"` to `scripts`

#### `dm-backend/src/app.module.ts`
- Import `MongooseModule.forRoot(process.env.MONGODB_URI)` in `imports[]`
- Import all feature modules created in Phase 2

#### `dm-backend/src/main.ts`
- Add `useGlobalPipes(new ValidationPipe({ whitelist: true }))` for DTO validation

#### `dm-backend/.env` (create if absent)
```
MONGODB_URI=mongodb://localhost:27017/duel-masters
JWT_SECRET=<random-secret>
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<bcrypt-hashed-or-plaintext-for-seeder>
```

---

## Phase 2A — Auth Module

### Files to create

#### `dm-backend/src/auth/strategies/google.strategy.ts`
`PassportStrategy(Strategy, 'google')` using `passport-google-oauth20`.
- Scopes: `['email', 'profile']`
- `validate(accessToken, refreshToken, profile)`:
  1. Extract `profile.emails[0].value` and `profile.id`
  2. Call `UsersService.findOrCreateGoogleUser({ googleId, email, username: profile.displayName })`
  3. Return user document

#### `dm-backend/src/auth/strategies/local.strategy.ts`
`PassportStrategy(Strategy, 'local')` using `passport-local`.
- `usernameField: 'username'`
- `validate(username, password)`:
  1. Call `AuthService.validateAdmin(username, password)`
  2. Verify `user.isAdmin === true`
  3. Compare `password` against `user.passwordHash` using `bcrypt.compare()`
  4. Return user or throw `UnauthorizedException`

#### `dm-backend/src/auth/strategies/jwt.strategy.ts`
`PassportStrategy(Strategy, 'jwt')` using `passport-jwt`.
- Extract JWT from `Authorization: Bearer <token>` header
- `validate(payload: { sub: string, isAdmin: boolean })`: return payload as req.user

#### `dm-backend/src/auth/guards/jwt-auth.guard.ts`
Extends `AuthGuard('jwt')`. Applied to all protected REST endpoints.

#### `dm-backend/src/auth/guards/local-auth.guard.ts`
Extends `AuthGuard('local')`. Applied to `POST /auth/admin/login`.

#### `dm-backend/src/auth/guards/roles.guard.ts`
Checks `req.user.isAdmin` for admin-only endpoints. Applied with `@UseGuards(JwtAuthGuard, RolesGuard)`.

#### `dm-backend/src/auth/auth.service.ts`
- `validateAdmin(username, password)` — used by local strategy
- `login(user)` — returns `{ access_token: JwtService.sign({ sub: user._id, isAdmin: user.isAdmin }) }`
- `googleLogin(user)` — calls `login(user)` and returns token + user profile

#### `dm-backend/src/auth/auth.controller.ts`
- `GET /auth/google` — redirect to Google consent screen (AuthGuard `'google'`)
- `GET /auth/google/callback` — receive OAuth callback, call `googleLogin()`, return JWT
- `POST /auth/admin/login` — body: `{ username, password }` (AuthGuard `'local'`), return JWT

#### `dm-backend/src/auth/dto/admin-login.dto.ts`
- `username: string` (`@IsString`, `@IsNotEmpty`)
- `password: string` (`@IsString`, `@IsNotEmpty`)

#### `dm-backend/src/auth/auth.module.ts`
Imports: `UsersModule`, `PassportModule`, `JwtModule.registerAsync({ useFactory: () => ({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: process.env.JWT_EXPIRES_IN } }) })`, `MongooseModule` for User schema.
Exports: `AuthService`, `JwtModule`.

#### `dm-backend/src/seeds/admin.seed.ts`
One-time seed script:
1. Connect to MongoDB
2. Check if a user with `isAdmin: true` already exists
3. If not, hash `process.env.ADMIN_PASSWORD` with `bcrypt.hash(password, 10)`
4. Create user: `{ username: process.env.ADMIN_USERNAME, email: 'admin@duel-masters.local', passwordHash, isAdmin: true }`
5. Disconnect

---

## Phase 2B — Users, Decks & Cards REST API

### Files to create

#### `dm-backend/src/users/users.service.ts`
- `findAll()` — admin only
- `findById(id)`
- `findByGoogleId(googleId)`
- `findOrCreateGoogleUser({ googleId, email, username })`
- `update(id, dto)` — user can update own; admin can update any
- `remove(id)` — admin only

#### `dm-backend/src/users/users.controller.ts`
All routes guarded by `JwtAuthGuard`.
- `GET /users` — admin only (RolesGuard)
- `GET /users/:id` — own profile or admin
- `PATCH /users/:id` — own profile or admin
- `DELETE /users/:id` — admin only

#### `dm-backend/src/users/dto/update-user.dto.ts`
- `username?: string`
- `email?: string`

#### `dm-backend/src/users/users.module.ts`
Imports `MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])`.
Exports `UsersService`.

---

#### `dm-backend/src/decks/decks.service.ts`
- `create(userId, dto)`:
  1. Validate total card count ≤ 40
  2. Validate each card count ≤ 4
  3. Verify each card ObjectId exists in `cards` collection
  4. Create and return deck
- `findByUser(userId)` — list user's decks
- `findById(id)` — populate card references
- `update(id, userId, dto)` — re-validate rules on update
- `remove(id, userId)` — owner or admin

#### `dm-backend/src/decks/decks.controller.ts`
All routes guarded by `JwtAuthGuard`. Deck operations scoped to `req.user.sub`.
- `POST /decks`
- `GET /decks` — returns current user's decks
- `GET /decks/:id`
- `PATCH /decks/:id`
- `DELETE /decks/:id`

#### `dm-backend/src/decks/dto/create-deck.dto.ts`
- `name: string` (`@IsString`, `@IsNotEmpty`)
- `cards: [{ cardId: string, count: number }]` (`@IsArray`, each item validated)

#### `dm-backend/src/decks/decks.module.ts`

---

#### `dm-backend/src/cards/cards.service.ts`
- `findAll(query?: { name?, civilization?, type? })` — with optional filters
- `findById(id)`

#### `dm-backend/src/cards/cards.controller.ts`
Public endpoints (no auth required — read-only reference data).
- `GET /cards` — supports query params `name`, `civilization`, `type`
- `GET /cards/:id`

#### `dm-backend/src/cards/cards.module.ts`
Exports `CardsService` (needed by seed script and DecksModule for card validation).

---

#### `dm-backend/src/seeds/cards.seed.ts`
Migration script (`npm run seed`):
1. Connect to MongoDB via `mongoose.connect(process.env.MONGODB_URI)`
2. Read `data/DuelMastersCards.json`
3. For each card in `cards[]`, upsert into `cards` collection matching on `name` (to be idempotent)
4. Map JSON fields to schema fields: `civilizations` → `civilizations[]`, `type`, `cost`, `power`, `text`, `subtypes`, `supertypes`, `printings`
5. Log count of inserted/updated documents
6. Disconnect

---

## Phase 2C — Game History Persistence

### Files to create

#### `dm-backend/src/games-history/games-history.service.ts`
- `createGame(game: GameInterface)` — called when a game is first added; inserts a `Game` document
- `updateGame(gameIdentifier, patch: Partial<GameInterface>)` — called on status changes (IN_PROGRESS, COMPLETED, ABORTED); updates `status`, `challenger`, `firstToGo`, `endedAt`
- `addStep(gameIdentifier, type, actor, event, payload)` — inserts a `GameStep` document
- `getGameHistory(gameIdentifier)` — returns game + all steps (used for future replay/analysis)

#### `dm-backend/src/games-history/games-history.module.ts`
Imports `MongooseModule.forFeature` for both `Game` and `GameStep` schemas.
Exports `GamesHistoryService`.

### Files to modify

#### `dm-backend/src/gateway/games.gateway.ts`
- Inject `GamesHistoryService`
- In `addGame` handler: after `gameRoomService.add()`, call `gamesHistoryService.createGame(game)`
- In `challenge` handler: call `gamesHistoryService.updateGame(gameIdentifier, { challenger })`
- In `duel` (startDuel) handler: call `gamesHistoryService.updateGame(gameIdentifier, { status: IN_PROGRESS })`
- In `gameLeaveHandler`: if game is deleted (inviter left), call `gamesHistoryService.updateGame(gameIdentifier, { status: ABORTED, endedAt: new Date() })`

#### `dm-backend/src/gateway/duel.gateway.ts`
- Inject `GamesHistoryService`
- In `cardDropped` handler: call `gamesHistoryService.addStep(gameRoom, 'move', client.id, 'dropCards', payload.data)`
- In `tapUntapCard` handler: call `gamesHistoryService.addStep(gameRoom, 'action', client.id, 'tapUntapCard', payload.data)`

#### `dm-backend/src/gateway/main.gateway.ts`
- Inject `GamesHistoryService`
- In `handleMessage`: call `gamesHistoryService.addStep(payload.gameRoom, 'chat', client.id, 'msgToClient', payload.data)`
