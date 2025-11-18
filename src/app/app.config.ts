import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';

import { appRoutes } from './app.routes';

// Interceptors (ajustar os paths se seus arquivos tiverem outro nome)
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';

// Auth
import { AuthService } from './core/auth/auth.service';

// função de inicialização do Auth (OIDC)
function initAuth(authService: AuthService) {
  return () => authService.initLoginSequence();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),

    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor
      ])
    ),

    provideOAuthClient(), // necessário pro OAuthService

    // garante que o angular-oauth2-oidc faz discovery + tryLoginCodeFlow
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [AuthService],
      multi: true
    }
  ]
};

