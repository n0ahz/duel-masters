import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/lobby/lobby.component').then((m) => m.LobbyComponent),
  },
  {
    path: 'game/:id',
    loadComponent: () =>
      import('./features/game-view/game-view.component').then(
        (m) => m.GameViewComponent,
      ),
  },
  {
    path: 'duel/:id',
    loadComponent: () =>
      import('./features/duel/duel.component').then((m) => m.DuelComponent),
  },
  {
    path: 'cards',
    loadComponent: () =>
      import('./features/cards/card-browser.component').then(
        (m) => m.CardBrowserComponent,
      ),
  },
  {
    path: 'decks',
    loadComponent: () =>
      import('./features/decks/deck-list.component').then(
        (m) => m.DeckListComponent,
      ),
  },
  {
    path: 'decks/new',
    loadComponent: () =>
      import('./features/decks/deck-builder.component').then(
        (m) => m.DeckBuilderComponent,
      ),
  },
  {
    path: 'decks/:deckId',
    loadComponent: () =>
      import('./features/decks/deck-builder.component').then(
        (m) => m.DeckBuilderComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
