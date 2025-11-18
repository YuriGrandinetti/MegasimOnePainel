import { Routes } from '@angular/router';
import { TenantsList } from './tenants/tenants-list/tenants-list/tenants-list';
import { TenantDetail } from './tenants/tenant-detail/tenant-detail/tenant-detail';
import { UsersList } from './users/users-list/users-list/users-list';
import { UserDetail } from './users/user-detail/user-detail/user-detail';
import { TenantMembershipsList } from './tenant-memberships/tenant-memberships-list/tenant-memberships-list/tenant-memberships-list';
import { TenantMembershipDetail } from './tenant-memberships/tenant-membership-detail/tenant-membership-detail/tenant-membership-detail';
import { RoleGuard } from '../../core/guards/role-guard';

export const IDENTITY_ROUTES: Routes = [
  {
    path: 'tenants',
    canActivate: [RoleGuard],
    // Aqui já usando o padrão novo:
    data: { roles: ['Global.SuperAdmin', 'Tenant.Admin'] },
    children: [
      { path: '', component: TenantsList },
      { path: ':id', component: TenantDetail }
    ]
  },
  {
    path: 'users',
    canActivate: [RoleGuard],
    data: { roles: ['Global.SuperAdmin'] },
    children: [
      { path: '', component: UsersList },
      { path: ':id', component: UserDetail }
    ]
  },
  {
    path: 'tenant-memberships',
    canActivate: [RoleGuard],
    data: { roles: ['Global.SuperAdmin', 'Tenant.Admin'] },
    children: [
      { path: '', component: TenantMembershipsList },
      { path: ':id', component: TenantMembershipDetail }
    ]
  },
  {
    path: 'access',
    canActivate: [RoleGuard],
    // Painel de perfis por tenant: Tenant.Admin ou Global.SuperAdmin
    data: { roles: ['Global.SuperAdmin', 'Tenant.Admin'] },
    loadComponent: () =>
      import('./tenant-access-panel/tenant-access-panel').then(m => m.TenantAccessPanel)
  },
  { path: '', redirectTo: 'tenants', pathMatch: 'full' }
];
