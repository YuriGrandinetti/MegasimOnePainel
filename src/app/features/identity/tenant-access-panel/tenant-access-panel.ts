import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

import { IdentityApi } from '../../../core/services/identity-api';
import { Auth } from '../../../core/auth/auth';
import { Notification } from '../../../core/services/notification';

import { IdentityUserDto } from '../../../core/models/auth/identity-user.dto';
import { ACCESS_PROFILES_CATALOG } from '../../../core/models/auth/access-profiles-catalog';
import { AccessProfile } from '../../../core/models/auth/access-profile.model';

@Component({
  selector: 'app-tenant-access-panel',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, AsyncPipe],
  templateUrl: './tenant-access-panel.html',
  styleUrls: ['./tenant-access-panel.scss']
})
export class TenantAccessPanel implements OnInit {

  tenantId: string | null = null;
  tenantName: string | null = null;

  loadingUsers = false;
  saving = false;

  users: IdentityUserDto[] = [];
  selectedUser: IdentityUserDto | null = null;

  // roles atuais do usuário nesse tenant
  currentRoles: string[] = [];

  // perfis disponíveis (catálogo)
  profiles: AccessProfile[] = ACCESS_PROFILES_CATALOG;

  // perfis selecionados (ids)
  selectedProfileIds = new Set<string>();

  constructor(
    private identityApi: IdentityApi,
    private auth: Auth,
    private notification: Notification
  ) { }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (!user || !user.tenantId) {
        this.tenantId = null;
        this.tenantName = null;
        this.users = [];
        this.selectedUser = null;
        this.currentRoles = [];
        this.selectedProfileIds.clear();
        return;
      }

      this.tenantId = user.tenantId;
      this.tenantName = user.tenantName ?? null;

      this.loadUsers();
    });
  }

  loadUsers(): void {
    if (!this.tenantId) {
      return;
    }

    this.loadingUsers = true;
    this.identityApi.getTenantUsers(this.tenantId).subscribe({
      next: list => {
        this.users = list ?? [];
        this.loadingUsers = false;
      },
      error: () => {
        this.loadingUsers = false;
        this.notification.error('Erro ao carregar usuários do tenant.');
      }
    });
  }

  onSelectUser(user: IdentityUserDto): void {
    if (!this.tenantId) {
      return;
    }

    this.selectedUser = user;
    this.currentRoles = [];
    this.selectedProfileIds.clear();

    this.identityApi.getTenantUserRoles(this.tenantId, user.id).subscribe({
      next: roles => {
        this.currentRoles = roles ?? [];
        this.recalculateProfilesFromRoles();
      },
      error: () => {
        this.notification.error('Erro ao carregar roles do usuário nesse tenant.');
      }
    });
  }

  /**
   * Quando carregamos roles do backend, inferimos perfis marcados.
   */
  private recalculateProfilesFromRoles(): void {
    this.selectedProfileIds.clear();

    for (const profile of this.profiles) {
      const hasAll = profile.roles.every(r =>
        this.currentRoles.includes(r)
      );

      if (hasAll) {
        this.selectedProfileIds.add(profile.id);
      }
    }
  }

  /**
   * Quando o usuário marca/desmarca um perfil, recalculamos as roles resultantes.
   */
  onToggleProfile(profile: AccessProfile, checked: boolean): void {
    if (checked) {
      this.selectedProfileIds.add(profile.id);
    } else {
      this.selectedProfileIds.delete(profile.id);
    }

    this.recalculateRolesFromProfiles();
  }

  /**
   * A partir dos perfis selecionados, gera set de roles final.
   */
  private recalculateRolesFromProfiles(): void {
    const rolesSet = new Set<string>();

    // garante que não perdemos roles que talvez não estejam mapeadas por perfil
    // (se quiser, pode limpar tudo e só aplicar roles via perfis)
    // currentRoles.forEach(r => rolesSet.add(r));

    for (const profile of this.profiles) {
      if (this.selectedProfileIds.has(profile.id)) {
        for (const role of profile.roles) {
          rolesSet.add(role);
        }
      }
    }

    this.currentRoles = Array.from(rolesSet);
  }

  onSave(): void {
    if (!this.tenantId || !this.selectedUser) {
      return;
    }

    this.saving = true;

    this.identityApi.setTenantUserRoles(this.tenantId, this.selectedUser.id, this.currentRoles)
      .subscribe({
        next: () => {
          this.saving = false;
          this.notification.success('Perfis/roles atualizados com sucesso.');
        },
        error: () => {
          this.saving = false;
          this.notification.error('Erro ao salvar roles do usuário nesse tenant.');
        }
      });
  }

  isProfileSelected(profile: AccessProfile): boolean {
    return this.selectedProfileIds.has(profile.id);
  }
}
