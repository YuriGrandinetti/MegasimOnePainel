import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../../../core/config/app-settings.token';
import { AppSettings } from '../../../core/config/app-settings.model';

export interface UserTenantDto {
  userId: string;
  tenantId: string;
  isDefault: boolean;
  roles: string[];
}

export interface CreateUserTenantRequest {
  userId: string;
  tenantId: string;
  isDefault: boolean;
  roles: string[];
}

export interface UpdateUserTenantRequest {
  isDefault: boolean;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TenantMembership {

  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(APP_SETTINGS) appSettings: AppSettings
  ) {
    this.baseUrl = appSettings.identityApiBaseUrl;
  }

  list(userId?: string, tenantId?: string): Observable<UserTenantDto[]> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId);
    }
    if (tenantId) {
      params = params.set('tenantId', tenantId);
    }

    return this.http.get<UserTenantDto[]>(`${this.baseUrl}/api/identity/user-tenants`, {
      params
    });
  }

  get(userId: string, tenantId: string): Observable<UserTenantDto | null> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('tenantId', tenantId);

    return this.http.get<UserTenantDto[]>(`${this.baseUrl}/api/identity/user-tenants`, { params })
      .pipe(
        // pega o primeiro item ou null
        (source) => new Observable<UserTenantDto | null>(observer => {
          const sub = source.subscribe({
            next: list => {
              observer.next(list[0] ?? null);
              observer.complete();
            },
            error: err => observer.error(err),
            complete: () => observer.complete()
          });
          return () => sub.unsubscribe();
        })
      );
  }

  create(request: CreateUserTenantRequest): Observable<UserTenantDto> {
    return this.http.post<UserTenantDto>(
      `${this.baseUrl}/api/identity/user-tenants`,
      request
    );
  }

  update(userId: string, tenantId: string, request: UpdateUserTenantRequest): Observable<UserTenantDto> {
    return this.http.put<UserTenantDto>(
      `${this.baseUrl}/api/identity/user-tenants/${userId}/${tenantId}`,
      request
    );
  }

  delete(userId: string, tenantId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/identity/user-tenants/${userId}/${tenantId}`
    );
  }
}


