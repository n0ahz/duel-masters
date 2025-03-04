import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Duel Masters: OCG / TCG';
  socialUser: SocialUser;

  constructor(
    private router: Router,
    public socialAuthService: SocialAuthService,
  ) {
    this.socialAuthService.authState.subscribe(async (res) => {
      this.socialUser = res;
    });
  }

  loginWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((socialUser: SocialUser) => {
      this.socialUser = socialUser;
      this.router.navigateByUrl('');
    });
  }

  logout() {
    this.socialAuthService.signOut().then((res) => {
      this.socialUser = null;
      this.router.navigateByUrl('');
    });
  }

}
