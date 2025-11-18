// src/app/core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '../auth/auth';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {

    const user = this.auth.currentUser;

    // 1) Não autenticado → manda pro login
    if (!user) {
      return this.router.parseUrl('/auth/login');
    }

    const requiredRolesRaw = route.data['roles'] as string[] | undefined;

    // 2) Se rota não especificou roles, só exige estar logado
    if (!requiredRolesRaw || requiredRolesRaw.length === 0) {
      return true;
    }

    const userRoles = (user.roles ?? []).map(r => r.toUpperCase());

    // 3) Global.SuperAdmin sempre pode tudo
    if (userRoles.includes('GLOBAL.SUPERADMIN')) {
      return true;
    }

    // 4) Normaliza roles exigidas (faz mapeamento dos aliases antigos)
    const requiredRoles = requiredRolesRaw.map(r => this.mapRoleAlias(r));

    // 5) Verifica interseção
    const hasAnyRequired = requiredRoles.some(req =>
      userRoles.includes(req.toUpperCase())
    );

    if (!hasAnyRequired) {
      // Sem permissão → manda pra home (ou página de acesso negado)
      return this.router.parseUrl('/');
    }

    return true;
  }

  /**
   * Faz o mapeamento de nomes simplificados para o padrão novo.
   * Ex.:
   *  - 'SuperAdmin'  -> 'Global.SuperAdmin'
   *  - 'TenantAdmin' -> 'Tenant.Admin'
   * Mantém qualquer outro valor como veio.
   */
  private mapRoleAlias(role: string): string {
    const r = role.toUpperCase().trim();

    switch (r) {
      case 'SUPERADMIN':
        return 'Global.SuperAdmin';
      case 'TENANTADMIN':
        return 'Tenant.Admin';
      default:
        return role;
    }
  }
}


