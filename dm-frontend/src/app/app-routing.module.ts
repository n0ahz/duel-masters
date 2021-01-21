import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PhaserTestComponent} from "./phaser-test/phaser-test.component";


const routes: Routes = [
  { path: '', component: PhaserTestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
