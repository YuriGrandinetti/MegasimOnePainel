import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';

import { Auth } from '../auth/auth';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    const requiredRoles = route.data['roles'] as string[] | undefined;

    // 1) Verifica se está autenticado (token válido)
    if (!this.authService.hasValidAccessToken()) {
      // não autenticado → manda pro login
      return this.router.parseUrl('/auth/login');
    }

    const user = this.auth.currentUser;

    if (!user) {
      // sem usuário na store → força login de novo
      return this.router.parseUrl('/auth/login');
    }

    // 2) Se não tem roles exigidas na rota, apenas exige estar logado
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const userRoles = user.roles ?? [];

    // 3) Verifica se o usuário tem pelo menos uma das roles exigidas
    const hasRequiredRole = userRoles.some(r => requiredRoles.includes(r));

    if (!hasRequiredRole) {
      // Sem permissão → manda pra home ou página de "acesso negado"
      return this.router.parseUrl('/');
    }

    return true;
  }
}
