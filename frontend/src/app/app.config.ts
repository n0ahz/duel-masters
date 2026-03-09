import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocialLoginModule, SocialAuthService, SOCIAL_AUTH_CONFIG, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

const socketConfig: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: { autoConnect: false },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom(SocketIoModule.forRoot(socketConfig)),
    importProvidersFrom(SocialLoginModule),
    SocialAuthService,
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId),
          },
        ],
      },
    },
  ],
};
