import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../config/app-settings.token';
import { AppSettings } from '../config/app-settings.model';
import { Tenant } from '../models/tenant/tenant.model';
import { TokenResponse } from '../models/auth/token-response.model';
import { IdentityUserDto } from '../../core/models/auth/identity-user.dto';


export interface IdentityTenantDto {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class IdentityApi {

  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(APP_SETTINGS) appSettings: AppSettings
  ) {
    this.baseUrl = appSettings.identityApiBaseUrl;
  }

  // ========= USERS =========

  /**
   * GET /api/identity/users
   * Retorna a lista de usuários Identity.
   */
  getUsers(): Observable<IdentityUserDto[]> {
    return this.http.get<IdentityUserDto[]>(`${this.baseUrl}/api/identity/users`);
  }

  /**
   * GET /api/identity/users/{id}
   */
  getUserById(id: string): Observable<IdentityUserDto> {
    return this.http.get<IdentityUserDto>(`${this.baseUrl}/api/identity/users/${id}`);
  }

  /**
   * POST /api/identity/users
   */
  createUser(payload: Partial<IdentityUserDto> & { password?: string }): Observable<IdentityUserDto> {
    return this.http.post<IdentityUserDto>(`${this.baseUrl}/api/identity/users`, payload);
  }

  /**
   * PUT /api/identity/users/{id}
   */
  updateUser(id: string, payload: Partial<IdentityUserDto>): Observable<IdentityUserDto> {
    return this.http.put<IdentityUserDto>(`${this.baseUrl}/api/identity/users/${id}`, payload);
  }

  /**
   * DELETE /api/identity/users/{id}
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/identity/users/${id}`);
  }

  // ========= TENANTS =========

  /**
   * GET /api/identity/tenants
   */
  getTenants(): Observable<IdentityTenantDto[]> {
    return this.http.get<IdentityTenantDto[]>(`${this.baseUrl}/api/identity/tenants`);
  }

  /**
   * GET /api/identity/tenants/{id}
   */
  getTenantById(id: string): Observable<IdentityTenantDto> {
    return this.http.get<IdentityTenantDto>(`${this.baseUrl}/api/identity/tenants/${id}`);
  }

  /**
   * POST /api/identity/tenants
   */
  createTenant(payload: Partial<IdentityTenantDto>): Observable<IdentityTenantDto> {
    return this.http.post<IdentityTenantDto>(`${this.baseUrl}/api/identity/tenants`, payload);
  }

  /**
   * PUT /api/identity/tenants/{id}
   */
  updateTenant(id: string, payload: Partial<IdentityTenantDto>): Observable<IdentityTenantDto> {
    return this.http.put<IdentityTenantDto>(`${this.baseUrl}/api/identity/tenants/${id}`, payload);
  }

  /**
   * DELETE /api/identity/tenants/{id}
   */
  deleteTenant(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/identity/tenants/${id}`);
  }

  /**
   * GET /api/identity/users/{id}/roles
   */
  getUserRoles(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/api/identity/users/${id}/roles`);
  }

  /**
   * PUT /api/identity/users/{id}/roles
   */
  updateUserRoles(id: string, roles: string[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/api/identity/users/${id}/roles`, { roles });
  }

   getMyTenants(): Observable<Tenant[]> {
      return this.http.get<Tenant[]>(`${this.baseUrl}/api/identity/my-tenants`);
    }
  
    switchTenant(tenantId: string): Observable<TokenResponse> {
      return this.http.post<TokenResponse>(
        `${this.baseUrl}/api/identity/switch-tenant`,
        { tenantId }
      );
    }
    /**
   * Usuários vinculados a um tenant específico
   */
  getTenantUsers(tenantId: string): Observable<IdentityUserDto[]> {
    return this.http.get<IdentityUserDto[]>(
      `${this.baseUrl}/api/identity/tenants/${tenantId}/users`
    );
  }

    /**
   * Roles do usuário em um tenant (UserTenantRoles.RoleName)
   */
  getTenantUserRoles(tenantId: string, userId: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/api/identity/tenants/${tenantId}/users/${userId}/roles`
    );
  }

  /**
   * Define as roles do usuário em um tenant (sobrescreve o conjunto atual)
   */
  setTenantUserRoles(tenantId: string, userId: string, roles: string[]): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/api/identity/tenants/${tenantId}/users/${userId}/roles`,
      { roles }
    );
  }
}

