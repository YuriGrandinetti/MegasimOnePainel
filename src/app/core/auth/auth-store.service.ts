// src/app/core/auth/auth-store.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { UserIdentity } from '../models/auth/user-identity.model';
import { TokenResponse } from '../models/auth/token-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {

  private readonly userSubject = new BehaviorSubject<UserIdentity | null>(null);
  readonly user$ = this.userSubject.asObservable();

  // token atual usado nas APIs (pode vir do OIDC normal ou do /switch-tenant)
  private apiAccessToken: string | null = null;

  constructor(private oAuthService: OAuthService) {
    this.oAuthService.events
      .pipe(
        filter((e: OAuthEvent) =>
          e.type === 'token_received' ||
          e.type === 'token_refreshed' ||
          e.type === 'session_terminated' ||
          e.type === 'session_error'
        )
      )
      .subscribe(() => this.updateFromIdToken());

    if (this.oAuthService.hasValidAccessToken()) {
      this.updateFromIdToken();
      // token inicial para API = token do OIDC
      this.apiAccessToken = this.oAuthService.getAccessToken() || null;
    }
  }

  /**
   * Atualiza usuário a partir do id_token/claims OIDC (login inicial).
   */
  private updateFromIdToken(): void {
    const claims: any = this.oAuthService.getIdentityClaims();

    if (!claims) {
      this.userSubject.next(null);
      this.apiAccessToken = null;
      return;
    }

    let roles: string[] = [];
    const roleClaim = claims['role'] ?? claims['roles'];

    if (Array.isArray(roleClaim)) {
      roles = roleClaim;
    } else if (typeof roleClaim === 'string') {
      roles = [roleClaim];
    }

    const user: UserIdentity = {
      id: claims['sub'],
      userName: claims['preferred_username'] ?? claims['name'] ?? '',
      email: claims['email'],
      roles,
      tenantId: claims['tenant_id'],
      tenantCode: claims['tenant_code'],
      tenantName: claims['tenant_name']
    };

    this.userSubject.next(user);
    this.apiAccessToken = this.oAuthService.getAccessToken() || null;
  }

  /**
   * Aplica um novo access_token vindo do endpoint /switch-tenant.
   * Decodifica o JWT e atualiza tenant + roles.
   */
  applyTokenResponseFromSwitchTenant(response: TokenResponse): void {
    this.apiAccessToken = response.access_token;

    const claims = this.decodeJwt(response.access_token);

    const current = this.userSubject.value;

    let roles: string[] = [];
    const roleClaim = claims['role'] ?? claims['roles'];

    if (Array.isArray(roleClaim)) {
      roles = roleClaim;
    } else if (typeof roleClaim === 'string') {
      roles = [roleClaim];
    }

    const updatedUser: UserIdentity = {
      id: claims['sub'] ?? current?.id ?? '',
      userName: claims['preferred_username'] ?? claims['name'] ?? current?.userName ?? '',
      email: claims['email'] ?? current?.email,
      roles,
      tenantId: claims['tenant_id'],
      tenantCode: claims['tenant_code'],
      tenantName: claims['tenant_name']
    };

    this.userSubject.next(updatedUser);

    // opcional: gravar em localStorage se quiser persistir entre reloads
    // localStorage.setItem('api_access_token', this.apiAccessToken);
  }

  get currentUser(): UserIdentity | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.apiAccessToken;
  }

  hasRole(...rolesToCheck: string[]): boolean {
    const user = this.userSubject.value;
    if (!user) {
      return false;
    }
    return rolesToCheck.some(r => user.roles.includes(r));
  }

  getTenantId(): string | null {
    return this.userSubject.value?.tenantId ?? null;
  }

  getRoles(): string[] {
    return this.userSubject.value?.roles ?? [];
  }

  /** Usado pelo interceptor para pegar o token atual */
  getAccessToken(): string | null {
    return this.apiAccessToken;
  }

  private decodeJwt(token: string): any {
    const [, payload] = token.split('.');
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  }
}
