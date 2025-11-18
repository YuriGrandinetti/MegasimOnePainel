import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Router } from '@angular/router';

import { DataGrid } from '../../../../../shared/components/ag-grid/data-grid/data-grid/data-grid';
import { IdentityApi, IdentityUserDto } from '../../../../../core/services/identity-api';
import { Notification } from '../../../../../core/services/notification';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, DataGrid],
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.scss']
})
export class UsersList implements OnInit {

  rowData: IdentityUserDto[] = [];
  loading = false;

  columnDefs: ColDef<IdentityUserDto>[] = [
    {
      headerName: 'Login',
      field: 'userName',
      flex: 2
    },
    {
      headerName: 'Email',
      field: 'email',
      flex: 3
    },
    {
      headerName: 'Super Admin',
      field: 'isGlobalSuperAdmin',
      flex: 1,
      valueFormatter: p => p.value ? 'Sim' : 'Não',
      cellClass: p => p.value ? 'text-success fw-bold' : 'text-muted'
    },
    {
      headerName: 'Ações',
      flex: 2,
      cellRenderer: (params: ICellRendererParams<IdentityUserDto>) => {
        const div = document.createElement('div');
        div.innerHTML = `
          <button class="btn btn-sm btn-outline-primary me-1">Editar</button>
          <button class="btn btn-sm btn-outline-secondary">Tenants</button>
        `;
        const [editBtn, tenantsBtn] = div.querySelectorAll('button');

        editBtn.addEventListener('click', () => {
          // TODO: quando tiver a tela de detalhe do usuário, ajustar rota aqui
          // this.router.navigate(['/identity/users', params.data!.id]);
          alert('Tela de detalhe de usuário ainda não implementada.');
        });

        tenantsBtn.addEventListener('click', () => {
          params.context.componentParent.onManageTenants(params.data!);
        });

        return div;
      }
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  gridContext = { componentParent: this };

  constructor(
    private identityApi: IdentityApi,
    private notification: Notification,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.identityApi.getUsers().subscribe({
      next: users => {
        this.rowData = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Erro ao carregar usuários.');
      }
    });
  }

  onManageTenants(user: IdentityUserDto): void {
    // abre a tela de vínculos já filtrando pelo usuário
    this.router.navigate(
      ['/identity/tenant-memberships'],
      { queryParams: { userId: user.id } }
    );
  }
}
