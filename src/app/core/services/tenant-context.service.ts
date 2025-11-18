// src/app/core/services/tenant-context.service.ts
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { IdentityApi } from './identity-api';
import { Tenant } from '../models/tenant/tenant.model';
import { Auth } from '../auth/auth';
import { AuthService } from '../auth/auth.service';
import { TokenResponse } from '../models/auth/token-response.model';

@Injectable({
  providedIn: 'root'
})
export class TenantContextService {

  constructor(
    private identityApi: IdentityApi,
    private auth: Auth,
    private authService: AuthService
  ) {}

  /**
   * Tenants que o usuário logado pode acessar
   * (usa /api/identity/my-tenants na Identity API)
   */
  getAvailableTenants(): Observable<Tenant[]> {
    return this.identityApi.getMyTenants();
  }

  /**
   * Tenant atual do usuário com base no Auth.user$
   */
  getCurrentTenant(): Observable<Tenant | null> {
    return this.auth.user$.pipe(
      map(user => {
        if (!user || !user.tenantId) {
          return null;
        }

        // Aqui assumo que Tenant = { id, code, name, isActive }
        // Ajuste se seu modelo tiver mais campos.
        const tenant: Tenant = {
          id: user.tenantId,
          code: '',            // se tiver claim tenant_code, pode usar aqui
          name: user.tenantName ?? '',
          isActive: true
        };

        return tenant;
      })
    );
  }

  /**
   * Troca o tenant atual do usuário chamando a Identity API
   * e aplicando o novo access_token no AuthService.
   */
  switchTenant(tenantId: string): Observable<TokenResponse> {
    return this.identityApi.switchTenant(tenantId).pipe(
      tap((response: TokenResponse) => {
        // TokenResponse precisa ter pelo menos accessToken
        this.authService.applyTokenResponse(response);
      })
    );
  }
}

