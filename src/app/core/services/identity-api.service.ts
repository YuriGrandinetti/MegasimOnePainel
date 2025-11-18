// src/app/core/services/identity-api.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../config/app-settings.token';
import { AppSettings } from '../config/app-settings.model';
import { Tenant } from '../models/tenant/tenant.model';
import { TokenResponse } from '../models/auth/token-response.model';

@Injectable({
  providedIn: 'root'
})
export class IdentityApiService {

  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(APP_SETTINGS) appSettings: AppSettings
  ) {
    this.baseUrl = appSettings.identityApiBaseUrl;
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

  
}
