import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ColDef, ICellRendererParams } from 'ag-grid-community';

import { DataGrid } from '../../../../../shared/components/ag-grid/data-grid/data-grid/data-grid';

import { TenantMembership, UserTenantDto, CreateUserTenantRequest } from '../../../services/tenant-membership'
import { Notification } from '../../../../../core/services/notification';

@Component({
  selector: 'app-tenant-memberships-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGrid],
  templateUrl: './tenant-memberships-list.html',
  styleUrls: ['./tenant-memberships-list.scss']
})
export class TenantMembershipsList implements OnInit {

  filterUserId = '';
  filterTenantId = '';
  loading = false;

  rowData: UserTenantDto[] = [];

  // Modal de criação
  showCreateModal = false;
  createModel: {
    userId: string;
    tenantId: string;
    isDefault: boolean;
    rolesText: string; // roles em texto, separadas por vírgula
  } = {
    userId: '',
    tenantId: '',
    isDefault: false,
    rolesText: ''
  };

  columnDefs: ColDef<UserTenantDto>[] = [
    {
      headerName: 'User ID',
      field: 'userId',
      flex: 2,
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Tenant ID',
      field: 'tenantId',
      flex: 2,
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Roles',
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
          <button class="btn btn-sm btn-outline-primary me-1">Editar</button>
          <button class="btn btn-sm btn-outline-danger">Remover</button>
        `;
        const [editBtn, delBtn] = div.querySelectorAll('button');

        editBtn.addEventListener('click', () => {
          params.context.componentParent.onEdit(params.data!);
        });

        delBtn.addEventListener('click', () => {
          params.context.componentParent.onDelete(params.data!);
        });

        return div;
      }
    }
  ];

  defaultColDef: ColDef = { resizable: true, sortable: true };

  gridContext = { componentParent: this };

  constructor(
    private tenantMembership: TenantMembership,
    private notification: Notification,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.tenantMembership
      .list(
        this.filterUserId.trim() || undefined,
        this.filterTenantId.trim() || undefined
      )
      .subscribe({
        next: data => {
          this.rowData = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.notification.error('Erro ao carregar vínculos.');
        }
      });
  }

  onClear() {
    this.filterUserId = '';
    this.filterTenantId = '';
    this.load();
  }

  onEdit(row: UserTenantDto) {
    this.router.navigate(['/identity/tenant-memberships', row.userId, row.tenantId]);
  }

  onDelete(row: UserTenantDto) {
    if (!confirm(`Remover vínculo do usuário ${row.userId}?`)) return;

    this.tenantMembership
      .delete(row.userId, row.tenantId)
      .subscribe({
        next: () => {
          this.notification.success('Vínculo removido.');
          this.load();
        },
        error: () => {
          this.notification.error('Não foi possível remover.');
        }
      });
  }

  // ---------- Modal criação ----------

  openCreateModal() {
    this.createModel = {
      userId: this.filterUserId || '',
      tenantId: this.filterTenantId || '',
      isDefault: false,
      rolesText: ''
    };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  saveCreate() {
    const roles = (this.createModel.rolesText || '')
      .split(',')
      .map(r => r.trim())
      .filter(r => !!r);

    const payload: CreateUserTenantRequest = {
      userId: this.createModel.userId,
      tenantId: this.createModel.tenantId,
      isDefault: this.createModel.isDefault,
      roles
    };

    if (!payload.userId || !payload.tenantId) {
      this.notification.error('UserId e TenantId são obrigatórios.');
      return;
    }

    this.tenantMembership.create(payload).subscribe({
      next: () => {
        this.notification.success('Vínculo criado com sucesso.');
        this.showCreateModal = false;
        this.load();
      },
      error: () => {
        this.notification.error('Erro ao criar vínculo.');
      }
    });
  }
}
