import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { APP_SETTINGS } from '../../../core/config/app-settings.token';
import { AppSettings } from '../../../core/config/app-settings.model';

import { Auth } from '../../../core/auth/auth';
import { AuthService } from '../../../core/auth/auth.service';
import { Notification } from '../../../core/services/notification';

interface MyTenantDto {
  tenantId: string;
  name: string;
  isCurrent: boolean;
}

interface SwitchTenantResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

@Component({
  selector: 'app-tenant-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tenant-switcher.html',
  styleUrls: ['./tenant-switcher.scss']
})
export class TenantSwitcher implements OnInit {

  tenants: MyTenantDto[] = [];
  currentTenantId: string | null = null;
  loading = false;
  switching = false;

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(APP_SETTINGS) appSettings: AppSettings,
    private auth: Auth,
    private authService: AuthService,
    private notification: Notification
  ) {
    this.baseUrl = appSettings.identityApiBaseUrl;
  }

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants(): void {
    this.loading = true;

    this.http
      .get<MyTenantDto[]>(`${this.baseUrl}/api/identity/my-tenants`)
      .subscribe({
        next: list => {
          this.tenants = list ?? [];
          const current = this.tenants.find(t => t.isCurrent);
          this.currentTenantId = current?.tenantId ?? null;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.notification.error('Erro ao carregar tenants do usuário atual.');
        }
      });
  }

  onChangeTenant(tenantId: string): void {
    if (!tenantId || tenantId === this.currentTenantId) {
      return;
    }

    this.switching = true;

    this.http
      .post<SwitchTenantResponse>(`${this.baseUrl}/api/identity/switch-tenant`, {
        tenantId
      })
      .subscribe({
        next: res => {
          this.switching = false;

          if (!res || !res.accessToken) {
            this.notification.error('Resposta inválida ao trocar tenant.');
            return;
          }

          // Atualiza access_token no angular-oauth2-oidc + store Auth
          this.authService.applyTokenResponse(res);

          // Atualiza seleção local
          this.currentTenantId = tenantId;
          this.tenants = this.tenants.map(t => ({
            ...t,
            isCurrent: t.tenantId === tenantId
          }));

          this.notification.success('Tenant alterado com sucesso.');
        },
        error: () => {
          this.switching = false;
          this.notification.error('Não foi possível alterar o tenant.');
        }
      });
  }
}
