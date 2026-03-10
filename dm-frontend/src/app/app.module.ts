import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhaserTestComponent } from './components/phaser-test/phaser-test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { AboutComponent } from './components/about/about.component';
import { GameListComponent } from './components/games/game-list/game-list.component';
import { GameAddComponent } from './components/games/game-add/game-add.component';
import { GameViewComponent } from './components/games/game-view/game-view.component';
import { CoinTossComponent } from './components/games/coin-toss/coin-toss.component';
import { DuelComponent } from './components/duel/duel.component';
import { CardInfoComponent } from './components/modals/card-info/card-info.component';
import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment';
import { RulesComponent } from './components/rules/rules.component';
import { SetsComponent } from './components/sets/sets.component';
import { SetDetailComponent } from './components/set-detail/set-detail.component';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    PhaserTestComponent,
    AboutComponent,
    GameListComponent,
    GameAddComponent,
    GameViewComponent,
    CoinTossComponent,
    DuelComponent,
    CardInfoComponent,
    RulesComponent,
    SetsComponent,
    SetDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    SocketIoModule.forRoot(config),
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatExpansionModule,
    MatGridListModule,
    MatChipsModule,
    MatDialogModule,
    GoogleSigninButtonModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
