import { Injectable, isDevMode } from '@angular/core';
import {
  SocialAuthService,
  SocialUser,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from './socket.service';
import { environment } from '../../../environments/environment';

const DEV_USER_ID_KEY = 'dm_dev_user_id';
const DEV_USER_NAME_KEY = 'dm_dev_user_name';
const PLACEHOLDER_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

function getOrCreateDevUser(): { id: string; name: string } {
  let id = localStorage.getItem(DEV_USER_ID_KEY);
  let name = localStorage.getItem(DEV_USER_NAME_KEY);
  if (!id || !name) {
    id = `dev-${Math.random().toString(36).slice(2, 10)}`;
    name = `Duelist ${Math.floor(Math.random() * 999) + 1}`;
    localStorage.setItem(DEV_USER_ID_KEY, id);
    localStorage.setItem(DEV_USER_NAME_KEY, name);
  }
  return { id, name };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser$ = new BehaviorSubject<SocialUser | null>(null);
  readonly isDevBypass: boolean;

  constructor(
    private socialAuthService: SocialAuthService,
    private socketService: SocketService,
  ) {
    this.isDevBypass =
      isDevMode() && environment.googleClientId === PLACEHOLDER_CLIENT_ID;

    if (this.isDevBypass) {
      const { id, name } = getOrCreateDevUser();
      console.warn(`[DEV] Auto-connecting as "${name}" (${id})`);
      this.socketService.connect(id, name);
      return;
    }

    this.socialAuthService.authState.subscribe((user) => {
      this.currentUser$.next(user);
      if (user) {
        this.socketService.connect(user.id || user.email || '', user.name || '');
      } else {
        this.socketService.disconnect();
      }
    });
  }

  signIn(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }
}
