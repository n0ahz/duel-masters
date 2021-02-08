import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhaserTestComponent } from "./components/phaser-test/phaser-test.component";
import { AboutComponent } from "./components/about/about.component";


const routes: Routes = [
  {path: '', redirectTo: 'about', pathMatch: 'full'},
  {path: 'about', component: AboutComponent},
  {path: 'test', component: PhaserTestComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
