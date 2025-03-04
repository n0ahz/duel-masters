import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhaserTestComponent } from './components/phaser-test/phaser-test.component';
import { AboutComponent } from './components/about/about.component';
import { GameListComponent } from './components/games/game-list/game-list.component';
import { GameAddComponent } from './components/games/game-add/game-add.component';
import { GameViewComponent } from './components/games/game-view/game-view.component';
import { DuelComponent } from './components/duel/duel.component';
import { AuthGuard } from './guards/auth.guard';
import { RulesComponent } from './components/rules/rules.component';
import { CardsComponent } from './components/cards/cards.component';


const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'cards', component: CardsComponent },
  { path: 'games/list', component: GameListComponent, canActivate: [AuthGuard] },
  { path: 'games/add', component: GameAddComponent, canActivate: [AuthGuard] },
  { path: 'games/view/:gameIdentifier', component: GameViewComponent, canActivate: [AuthGuard] },
  { path: 'duel', component: DuelComponent, canActivate: [AuthGuard] },
  { path: 'test', component: PhaserTestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
