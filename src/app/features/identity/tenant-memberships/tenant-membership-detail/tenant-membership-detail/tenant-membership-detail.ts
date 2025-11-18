import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  TenantMembership,
  UpdateUserTenantRequest
} from '../../../services/tenant-membership';

import { Notification } from '../../../../../core/services/notification'
@Component({
  selector: 'app-tenant-membership-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tenant-membership-detail.html',
  styleUrls: ['./tenant-membership-detail.scss']
})
export class TenantMembershipDetail implements OnInit {

  userId = '';
  tenantId = '';

  isDefault = false;
  roles: string[] = [];
  newRole = '';

  loading = false;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenantMembership: TenantMembership,
    private notification: Notification
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') ?? '';
    this.tenantId = this.route.snapshot.paramMap.get('tenantId') ?? '';

    if (!this.userId || !this.tenantId) {
      this.notification.error('Parâmetros de rota inválidos.');
      this.goBack();
      return;
    }

    this.load();
  }

  load(): void {
    this.loading = true;

    this.tenantMembership
      .get(this.userId, this.tenantId)
      .subscribe({
        next: dto => {
          if (!dto) {
            this.notification.error('Vínculo usuário x tenant não encontrado.');
            this.goBack();
            return;
          }

          this.isDefault = dto.isDefault;
          this.roles = [...(dto.roles ?? [])];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.notification.error('Erro ao carregar vínculo usuário x tenant.');
        }
      });
  }

  onAddRole(): void {
    const value = (this.newRole ?? '').trim();
    if (!value) return;

    if (!this.roles.includes(value)) {
      this.roles.push(value);
    }

    this.newRole = '';
  }

  onRoleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onAddRole();
    }
  }

  removeRole(role: string): void {
    this.roles = this.roles.filter(r => r !== role);
  }

  save(): void {
    const payload: UpdateUserTenantRequest = {
      isDefault: this.isDefault,
      roles: this.roles
    };

    this.saving = true;

    this.tenantMembership
      .update(this.userId, this.tenantId, payload)
      .subscribe({
        next: () => {
          this.saving = false;
          this.notification.success('Vínculo atualizado com sucesso.');
          this.goBack();
        },
        error: () => {
          this.saving = false;
          this.notification.error('Não foi possível salvar as alterações.');
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/identity/tenant-memberships']);
  }
}
