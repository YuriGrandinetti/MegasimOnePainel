import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, ICellRendererParams } from 'ag-grid-community';

import { IdentityApi, IdentityUserDto } from '../../../../../core/services/identity-api';
import { Notification } from '../../../../../core/services/notification';
import { TenantMembership, UserTenantDto } from '../../../services/tenant-membership';
import { DataGrid } from '../../../../../shared/components/ag-grid/data-grid/data-grid/data-grid';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGrid],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.scss']
})
export class UserDetail implements OnInit {

  userId = '';
  user: IdentityUserDto | null = null;

  // estados de carregamento/salvamento
  loadingUser = false;
  savingUser = false;
  loadingRoles = false;
  savingRoles = false;
  loadingTenants = false;

  // roles globais
  globalRoles: string[] = [];
  newRole = '';

  // aba ativa
  activeTab: 'dados' | 'roles' | 'tenants' = 'dados';

  // tenants (memberships)
  tenantMemberships: UserTenantDto[] = [];

  tenantColumnDefs: ColDef<UserTenantDto>[] = [
    {
      headerName: 'Tenant ID',
      field: 'tenantId',
      flex: 2
    },
    {
      headerName: 'Roles (no tenant)',
      field: 'roles',
      flex: 3,
      valueGetter: p => (p.data?.roles ?? []).join(', ')
    },
    {
      headerName: 'Default',
      field: 'isDefault',
      flex: 1,
      valueFormatter: p => (p.value ? 'Sim' : 'Não'),
      cellClass: p => p.value ? 'text-success fw-bold' : 'text-muted text-center'
    },
    {
      headerName: 'Ações',
      flex: 2,
      cellRenderer: (params: ICellRendererParams<UserTenantDto>) => {
        const div = document.createElement('div');
        div.innerHTML = `
          <button class="btn btn-sm btn-outline-primary">Editar vínculo</button>
        `;
        const btn = div.querySelector('button')!;
        btn.addEventListener('click', () => {
          params.context.componentParent.onEditMembership(params.data!);
        });
        return div;
      }
    }
  ];

  tenantDefaultColDef: ColDef = { resizable: true, sortable: true };
  tenantGridContext = { componentParent: this };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private identityApi: IdentityApi,
    private tenantMembership: TenantMembership,
    private notification: Notification
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.userId) {
      this.notification.error('Parâmetro de rota inválido (id do usuário ausente).');
      this.goBack();
      return;
    }

    this.loadUser();
    this.loadRoles();
    this.loadTenants();
  }

  // ========== ABA DADOS ==========

  loadUser(): void {
    this.loadingUser = true;

    this.identityApi.getUserById(this.userId).subscribe({
      next: user => {
        this.user = { ...user };
        this.loadingUser = false;
      },
      error: () => {
        this.loadingUser = false;
        this.notification.error('Erro ao carregar dados do usuário.');
      }
    });
  }

  saveUser(): void {
    if (!this.user) return;

    const payload: Partial<IdentityUserDto> = {
      userName: this.user.userName,
      email: this.user.email,
      isGlobalSuperAdmin: this.user.isGlobalSuperAdmin
    };

    this.savingUser = true;

    this.identityApi.updateUser(this.userId, payload).subscribe({
      next: u => {
        this.user = u;
        this.savingUser = false;
        this.notification.success('Dados do usuário salvos com sucesso.');
      },
      error: () => {
        this.savingUser = false;
        this.notification.error('Não foi possível salvar os dados do usuário.');
      }
    });
  }

  // ========== ABA ROLES GLOBAIS ==========

  loadRoles(): void {
    this.loadingRoles = true;

    this.identityApi.getUserRoles(this.userId).subscribe({
      next: roles => {
        this.globalRoles = roles ?? [];
        this.loadingRoles = false;
      },
      error: () => {
        this.loadingRoles = false;
        this.notification.error('Erro ao carregar roles globais do usuário.');
      }
    });
  }

  addGlobalRole(): void {
    const role = (this.newRole ?? '').trim();
    if (!role) return;

    if (!this.globalRoles.includes(role)) {
      this.globalRoles.push(role);
    }

    this.newRole = '';
  }

  onGlobalRoleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addGlobalRole();
    }
  }

  removeGlobalRole(role: string): void {
    this.globalRoles = this.globalRoles.filter(r => r !== role);
  }

  saveRoles(): void {
    this.savingRoles = true;

    this.identityApi.updateUserRoles(this.userId, this.globalRoles).subscribe({
      next: () => {
        this.savingRoles = false;
        this.notification.success('Roles globais atualizadas com sucesso.');
      },
      error: () => {
        this.savingRoles = false;
        this.notification.error('Não foi possível salvar as roles globais.');
      }
    });
  }

  // ========== ABA TENANTS ==========

  loadTenants(): void {
    this.loadingTenants = true;

    this.tenantMembership.list(this.userId, undefined).subscribe({
      next: memberships => {
        this.tenantMemberships = memberships;
        this.loadingTenants = false;
      },
      error: () => {
        this.loadingTenants = false;
        this.notification.error('Erro ao carregar tenants do usuário.');
      }
    });
  }

  onEditMembership(row: UserTenantDto): void {
    this.router.navigate(['/identity/tenant-memberships', row.userId, row.tenantId]);
  }

  // ========== NAVEGAÇÃO / TABS ==========

  setTab(tab: 'dados' | 'roles' | 'tenants'): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/identity/users']);
  }
}

