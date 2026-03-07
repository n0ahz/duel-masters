# Duel Masters — Phaser Integration Review

This document analyses how Phaser 3 is set up and used, identifies problems with the current approach, and recommends concrete improvements.

---

## Short Answer

The Phaser game works, but the integration with Angular has several structural problems. The most serious are a missing `game.destroy()` call (memory leak on navigation), dynamic card texture loading during gameplay (causes visible stutter), and most of the game-engine code violating separation of concerns by mixing data models, rendering, input handling, and socket communication in the same classes.

---

## 1. Game Instance — Creation and Destruction

### Creation

`DuelService` builds the Phaser config and exposes `createGame()`. `DuelComponent.ngOnInit()` calls it and immediately starts the scene, passing Angular services as data:

```typescript
// duel.component.ts:37-42
this.phaserGame = this.duelService.createGame();
this.phaserGame.scene.start('duel', {
  socketService: this.socketService,
  gameService: this.gameService,
  duelService: this.duelService,
});
```

### Destruction — Missing

`ngOnDestroy` never calls `destroy()` on the Phaser instance:

```typescript
// duel.component.ts:82-85
ngOnDestroy(): void {
  this.gameService.leaveGame();
  this.socketService.removeAllListeners();
  // this.phaserGame.destroy(true) is never called
}
```

When the player navigates away from the duel route, the Phaser canvas, its WebGL context, all scene objects, and all event listeners remain alive. If the user re-enters the duel route, a second Phaser instance is created on top of the first.

**Fix:**
```typescript
ngOnDestroy(): void {
  this.phaserGame?.destroy(true);   // true = remove the canvas from DOM
  this.gameService.leaveGame();
  this.socketService.removeAllListeners();
}
```

Also store a reference in `DuelService` so it can be destroyed defensively from there too.

---

## 2. Angular ↔ Phaser Communication

### How Services Reach the Scene

Angular services are passed as plain data through `scene.start()` and stored as scene properties:

```typescript
// duel.scene.ts:71-74
create(data) {
  this.socketService = data.socketService;
  this.gameService   = data.gameService;
  this.duelService   = data.duelService;
  // ...
}
```

This works for a proof-of-concept but is fragile:

- The scene has no static type contract with its init data — `data` is untyped. If the component starts the scene without one of the services, the failure is silent until something crashes.
- Deep in the game engine (`zone-card.ts`, `duel-zone.ts`), objects receive the full Phaser scene reference and call `zone.scene.socketService.emitTo(...)`. This means every individual card on the field has a path to the socket — a large surface area.

**Fix — define a typed init interface:**
```typescript
// duel.scene.ts
interface DuelSceneData {
  socketService: SocketService;
  gameService:   GameService;
  duelService:   DuelService;
}

init(data: DuelSceneData): void {   // use init(), not create(), for data
  this.socketService = data.socketService;
  this.gameService   = data.gameService;
  this.duelService   = data.duelService;
}
```

**Fix — narrow the surface area for sub-objects:**

Instead of passing the full scene into every `ZoneCard`, pass only what it needs:

```typescript
interface ZoneCardCallbacks {
  onDrop(fromZone: string, toZone: string, card: ZoneCard, x: number, y: number): void;
  onTapUntap(zoneId: string, cardId: string): void;
  onHoverStart(card: ZoneCard): void;
  onHoverEnd(): void;
}
```

`DuelScene` implements these callbacks and passes them down. Cards no longer know about the socket at all.

---

## 3. Scene Architecture — One Large Scene Doing Everything

`duel.scene.ts` is 444 lines and does five unrelated things:

| Responsibility | Example lines |
|---|---|
| Registering socket event listeners | 128–176 |
| Initial game setup / dealing cards | 128–176 (via `duelist.startGame`) |
| Creating zone layout and rendering | 287–442 |
| Per-frame update loop | 235–244 |
| Animation helpers (card display, tween) | 247–290 |

**There is no Preload scene.** The entire asset load and scene setup happen in a single `preload()` → `create()` flow with no loading bar, no graceful fallback if an asset fails, and no way to add a boot sequence later.

### Recommended Scene Split

```
Boot Scene       ← show loading bar, fetch game config from server
Preload Scene    ← load all static assets (bg, card-back, zone icons, avatars)
Duel Scene       ← pure gameplay; assumes all assets already loaded
```

```typescript
// duel.service.ts — updated config
scene: [BootScene, PreloadScene, DuelScene]
```

`PreloadScene` loads everything in `preload()` and calls `this.scene.start('duel', data)` in `create()`. `DuelScene.preload()` becomes empty, which is where it belongs for a game scene.

---

## 4. Asset Loading During Gameplay

Card front images are loaded on demand inside `ZoneCard.render()`:

```typescript
// zone-card.ts:200-204
zone.scene.load.image(this.card.image, 'assets/imgs/cards/' + this.card.image);
zone.scene.load.once('complete', () => {
  this.cardImageLoadHandler(zone, this.card.image, xOrd, yOrd);
});
zone.scene.load.start();
```

Every time a previously unseen card is revealed, the game pauses the Phaser loader, fetches the image, and then renders. Players see a stutter or blank card for a moment. If two cards are revealed in quick succession, the `load.once('complete')` callback races.

**Fix — preload all card textures the player will see during `PreloadScene`.**

The duel deck composition is known before the scene starts (received in the `IKUJO` socket event). Pass it to `PreloadScene` and bulk-load all images before `DuelScene` launches:

```typescript
// preload.scene.ts
preload(): void {
  // Static assets
  this.load.image('bg', 'assets/imgs/bg.jpg');
  // ...

  // Dynamic card textures — deck is known at this point
  this.deckCards.forEach(card => {
    if (!this.textures.exists(card.image)) {
      this.load.image(card.image, `assets/imgs/cards/${card.image}`);
    }
  });
}
```

Also add a texture existence check before loading to avoid duplicate requests.

---

## 5. `ZoneCard` — Too Many Responsibilities

`zone-card.ts` is 206 lines and handles four unrelated concerns in a single class:

1. **Data model** — `card`, `uid`, `ownerId`, `isTapped`
2. **Rendering** — `render()`, `cardImageLoadHandler()`, `positionAllCards()`
3. **Input handling** — drag, drop, right-click, hover (lines 56–119)
4. **Game state** — `tapUntapCard()`, `negateCardDragDropEffect()`

The input handling block alone is 64 lines inside one method. It uses the pattern `.off('event').on('event', fn)` five times in a row, which removes *all* listeners for that event (including any added elsewhere) then adds one back — a side-effect-heavy approach.

### Suggested Decomposition

```
ZoneCard          ← data only: card, uid, ownerId, isTapped
ZoneCardView      ← wraps Phaser.GameObjects.Image; owns position/scale/rotation
ZoneCardInput     ← attaches drag/drop/hover to a ZoneCardView; fires typed callbacks
```

```typescript
// zone-card-input.ts
export class ZoneCardInput {
  constructor(
    private view: ZoneCardView,
    private callbacks: ZoneCardCallbacks,
  ) {
    this.attach();
  }

  private attach(): void {
    const img = this.view.image;

    img.on('drag', (_p: Phaser.Input.Pointer, x: number, y: number) => {
      this.view.setPosition(x, y);
    });

    img.on('drop', (_p: Phaser.Input.Pointer, target: Phaser.GameObjects.Zone) => {
      const targetZone = target.getData('zone') as DuelZone;
      this.callbacks.onDrop(this.view.zone, targetZone, this.view.zoneCard);
    });

    img.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (p.rightButtonDown()) this.callbacks.onTapUntap(this.view.zoneCard);
    });
  }

  destroy(): void {
    this.view.image.removeAllListeners();
  }
}
```

---

## 6. Game Sequencing — `setTimeout` Instead of Phaser Tweens

`Duelist.startGame()` uses nested `setTimeout` calls to sequence the opening deal:

```typescript
// duelist.ts:55-75
setTimeout(() => {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      deckZone.transferCards(deckZone.takeCards(1, PositionsEnum.BOTTOM), shieldZone);
    }, 100 * i);
  }
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        deckZone.transferCards(deckZone.takeCards(1, PositionsEnum.BOTTOM), handZone);
      }, 100 * i);
    }
  }, 2000);
}, 3000);
```

`setTimeout` runs outside Phaser's game loop. If the game is paused, backgrounded, or the tab is throttled, timers fire at the wrong time. Phaser's `Time.addEvent` and tween timeline are tied to the game clock and respect pause/resume.

**Fix — use Phaser's timeline:**

```typescript
// duelist.ts
startGame(scene: DuelScene, deckZone: DuelZone, shieldZone: DuelZone, handZone: DuelZone): void {
  const CARD_INTERVAL = 120;
  const SHIELD_TO_HAND_GAP = 2000;
  const INITIAL_DELAY = 3000;
  const CARD_COUNT = 5;

  let delay = INITIAL_DELAY;

  // Deal shields
  for (let i = 0; i < CARD_COUNT; i++) {
    scene.time.addEvent({
      delay: delay + i * CARD_INTERVAL,
      callback: () => deckZone.transferCards(deckZone.takeCards(1, PositionsEnum.BOTTOM), shieldZone),
    });
  }

  delay += CARD_COUNT * CARD_INTERVAL + SHIELD_TO_HAND_GAP;

  // Draw hand
  for (let i = 0; i < CARD_COUNT; i++) {
    scene.time.addEvent({
      delay: delay + i * CARD_INTERVAL,
      callback: () => deckZone.transferCards(deckZone.takeCards(1, PositionsEnum.BOTTOM), handZone),
    });
  }
}
```

The same applies to any `setTimeout` in `DuelZone.destroyRenderedCard()` (line 84).

---

## 7. Socket Events Inside the Scene

All socket `handleEvent` calls are registered in `DuelScene.create()`. This means:

- Socket listeners are created once and never removed — they survive if the scene is restarted.
- Game state changes (e.g. card drop, tap) are wired directly to socket events with no intermediate layer.
- The scene both *listens* and *emits* — there is no separation between the communication layer and the game layer.

**Fix — move all socket wiring to a dedicated coordinator:**

```typescript
// duel-socket-coordinator.ts
export class DuelSocketCoordinator {
  constructor(
    private socket: SocketService,
    private scene: DuelScene,
    private gameId: string,
  ) {}

  start(): void {
    this.socket.on(DuelEventsEnum.ALL_SET,        res => this.onAllSet(res));
    this.socket.on(DuelEventsEnum.IKUJO,          res => this.onIkujo(res));
    this.socket.on(DuelEventsEnum.DROP_CARDS,     res => this.onDropCards(res));
    this.socket.on(DuelEventsEnum.TAP_UNTAP_CARD, res => this.onTapUntap(res));
  }

  stop(): void {
    this.socket.off(DuelEventsEnum.ALL_SET);
    this.socket.off(DuelEventsEnum.IKUJO);
    this.socket.off(DuelEventsEnum.DROP_CARDS);
    this.socket.off(DuelEventsEnum.TAP_UNTAP_CARD);
  }

  private onDropCards(res): void {
    this.scene.setCard(res.data);
  }
  // ...
}
```

`DuelScene.create()` instantiates the coordinator and calls `start()`. `DuelScene.shutdown()` (Phaser's own lifecycle event) calls `coordinator.stop()`.

---

## 8. Physics Config Is Unused

`duel.service.ts` enables Arcade physics:

```typescript
// duel.service.ts:29-31
physics: {
  default: 'arcade',
},
```

No game object in the codebase uses physics bodies, gravity, velocity, or collision. This adds overhead (physics world step every frame) with no benefit.

**Fix:** Remove the `physics` block entirely from the config.

---

## 9. Input Is Mouse-Only

All `ZoneCard` input uses mouse-specific checks:

```typescript
// zone-card.ts:94
if (pointer.rightButtonDown()) { // tap/untap
```

Phaser's drag system is pointer-agnostic, but right-click for tapping won't work on touch screens. There is no alternative tap gesture.

**Fix:** Detect long-press or two-finger tap as the touch equivalent of right-click. Phaser's `pointer.getDuration()` (already referenced on line 96) can detect hold duration.

---

## 10. Game Logic vs Rendering — Mixed Throughout

The current layering:

```
DuelScene.create()     → orchestrates, wires sockets, positions zones
DuelScene.render*()    → creates Phaser objects
DuelZone               → manages card collections AND creates drop zones
ZoneCard               → holds card data AND creates Phaser images AND handles input
Duelist.startGame()    → game sequence logic mixed with setTimeout timers
```

The ideal layering for a Phaser game this size:

```
Game Rules Layer       → pure TypeScript: what moves are legal, win conditions
Game State Layer       → manages collections of cards, zones, players
Scene Layer            → translates state changes into Phaser object creation/destruction
Input Layer            → translates Phaser input events into game rule calls
Network Layer          → syncs state changes with the server via socket
```

Right now there is no game rules layer — legality is only checked on the server. And the state, rendering, and input layers are all collapsed into the same classes.

---

## Summary

| Issue | Severity | File |
|---|---|---|
| `phaserGame.destroy()` never called on navigation | Critical | `duel.component.ts:82` |
| Card textures loaded during gameplay, causing stutter | High | `zone-card.ts:200` |
| No Preload scene — no loading progress feedback | High | `duel.service.ts` |
| `setTimeout` used instead of `scene.time.addEvent` | High | `duelist.ts:55` |
| Socket listeners registered in scene, never removed | High | `duel.scene.ts:128` |
| `ZoneCard` mixes data model, rendering, and input | High | `zone-card.ts` |
| Angular services injected via untyped `data` object | Medium | `duel.scene.ts:71` |
| Deep objects reach socket via `zone.scene.socketService` | Medium | `zone-card.ts:84` |
| Arcade physics enabled but not used | Low | `duel.service.ts:29` |
| Input is mouse-only (no touch equivalent) | Medium | `zone-card.ts:94` |
| Game logic and rendering not separated into layers | High | Architecture-wide |
