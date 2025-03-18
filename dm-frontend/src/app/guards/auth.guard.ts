import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, map, tap  } from 'rxjs';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {

  constructor(
    private router: Router,
    private authService: SocialAuthService,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.authState.pipe(
      map((socialUser: SocialUser) => !!socialUser),
      tap((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.router.navigateByUrl('');
        }
      }),
    );
  }

}
