import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    // Já tem token válido? deixa passar
    if (this.authService.hasValidAccessToken()) {
      return true;
    }

    // Não autenticado: dispara fluxo de login OIDC e salva returnUrl
    this.authService.login(state.url);

    // Cancela a navegação atual (o navegador vai para o IdP)
    return false;
  }
}
