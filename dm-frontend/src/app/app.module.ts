import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhaserTestComponent } from './components/phaser-test/phaser-test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { AboutComponent } from './components/about/about.component';
import { GameListComponent } from './components/games/game-list/game-list.component';
import { GameAddComponent } from './components/games/game-add/game-add.component';
import { GameViewComponent } from './components/games/game-view/game-view.component';
import { CoinTossComponent } from './components/games/coin-toss/coin-toss.component';
import { DuelComponent } from './components/duel/duel.component';
import { CardInfoComponent } from './components/modals/card-info/card-info.component';
import { GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { RulesComponent } from './components/rules/rules.component';
import { CardsComponent } from './components/cards/cards.component';


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
        CardsComponent,
    ],
    imports: [
        BrowserModule,
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
    ],
    providers: [
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: true,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider('519801663676-moqibve9j510ppopc8mk8t3cdm72inef.apps.googleusercontent.com'),
                    },
                ],
            },
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
