import { Injectable } from '@angular/core';
import { OAuthService, OAuthEvent, OAuthStorage } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';

import { authConfig } from './auth-config';
import { Auth, AuthUser } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private oAuthService: OAuthService,
    private auth: Auth,
    private oAuthStorage: OAuthStorage       // << novo
  ) {
    this.configure();
  }

  private configure(): void {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();

    // sempre que um token for recebido/renovado, atualiza a store
    this.oAuthService.events
      .pipe(filter((e: OAuthEvent) =>
        e.type === 'token_received' || e.type === 'token_refreshed'
      ))
      .subscribe(() => {
        this.updateAuthFromToken();
      });

    // em alguns eventos de erro/término de sessão, limpa a store
    this.oAuthService.events
      .pipe(filter((e: OAuthEvent) =>
        e.type === 'session_terminated' || e.type === 'session_error'
      ))
      .subscribe(() => {
        this.auth.clear();
      });
  }

  /**
   * Chamar uma vez no start da aplicação (ex.: AppComponent)
   */
  async initLoginSequence(): Promise<void> {
    // Carrega metadados do servidor OIDC (/.well-known/openid-configuration)
    await this.oAuthService.loadDiscoveryDocument();

    // Tenta finalizar o code flow (depois do callback)
    await this.oAuthService.tryLoginCodeFlow();

    // Atualiza a store com o token atual (se houver)
    this.updateAuthFromToken();

    // Se quiser forçar login se não tiver token válido:
    // if (!this.oAuthService.hasValidAccessToken()) {
    //   this.login();
    // }
  }

  login(returnUrl?: string): void {
    const extras = returnUrl ? { state: returnUrl } : undefined;
    this.oAuthService.initCodeFlow(undefined, extras);
  }

  logout(): void {
    // limpa store local
    this.auth.clear();
    // faz logout OIDC (revoga sessão no IdP)
    this.oAuthService.logOut();
  }

  get accessToken(): string | null {
    const token = this.oAuthService.getAccessToken();
    return token || null;
  }

  hasValidAccessToken(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  /**
   * Aplicado quando o backend retorna um novo access_token
   * (ex.: endpoint /switch-tenant)
   */
  applyTokenResponse(res: { accessToken: string; refreshToken?: string; expiresIn?: number }): void {
    if (!res || !res.accessToken) {
      return;
    }

    // Atualiza o access_token no storage usado pelo angular-oauth2-oidc
    this.oAuthStorage.setItem('access_token', res.accessToken);

    // Se em algum momento você devolver id_token junto, poderia salvar aqui:
    // this.oAuthStorage.setItem('id_token', res.idToken);

    // Recalcula claims/usuário a partir do novo token
    this.updateAuthFromToken();
  }

  // =============== PRIVADO: sincroniza Auth com o token atual ===============

  private updateAuthFromToken(): void {
    const accessToken = this.oAuthService.getAccessToken();
    const claims: any = this.oAuthService.getIdentityClaims();

    if (!accessToken || !claims) {
      this.auth.setUser(null);
      return;
    }

    const roles = this.extractRolesFromClaims(claims);

    const user: AuthUser = {
      id: claims.sub ?? claims['sub'],
      userName: claims.preferred_username || claims['name'] || claims['unique_name'],
      email: claims.email,
      tenantId: claims['tenant_id'],
      tenantName: claims['tenant_name'],
      roles
    };

    this.auth.setUser(user);
  }

  private extractRolesFromClaims(claims: any): string[] {
    if (!claims) {
      return [];
    }

    // pode vir como 'role', 'roles', array ou string simples
    let roles: string[] = [];

    if (Array.isArray(claims.role)) {
      roles = claims.role;
    } else if (typeof claims.role === 'string') {
      roles = [claims.role];
    }

    if (Array.isArray(claims.roles)) {
      roles = roles.concat(claims.roles);
    } else if (typeof claims.roles === 'string') {
      roles.push(claims.roles);
    }

    return Array.from(new Set(roles)); // remove duplicados
  }
}

