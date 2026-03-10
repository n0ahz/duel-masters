import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { ThemeService } from './services/theme.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'Duel Masters: OCG / TCG';
  socialUser: SocialUser;

  constructor(
    private router: Router,
    public socialAuthService: SocialAuthService,
    public themeService: ThemeService,
  ) {
    this.socialAuthService.authState.subscribe(async (res) => {
      this.socialUser = res;
    });
  }

  logout() {
    this.socialAuthService.signOut().then(() => {
      this.socialUser = null;
      this.router.navigateByUrl('');
    });
  }
}
