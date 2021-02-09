import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhaserTestComponent } from "./components/phaser-test/phaser-test.component";
import { AboutComponent } from "./components/about/about.component";
import { GameListComponent } from "./components/games/game-list/game-list.component";
import { GameAddComponent } from "./components/games/game-add/game-add.component";
import { GameViewComponent } from "./components/games/game-view/game-view.component";


const routes: Routes = [
  {path: '', redirectTo: 'about', pathMatch: 'full'},
  {path: 'about', component: AboutComponent},
  {path: 'games/list', component: GameListComponent},
  {path: 'games/add', component: GameAddComponent},
  {path: 'games/view/:gameIdentifier', component: GameViewComponent},
  {path: 'test', component: PhaserTestComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
