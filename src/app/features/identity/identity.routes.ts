// src/app/features/identity/identity.routes.ts
import { Routes } from '@angular/router';
import { TenantsList } from './tenants/tenants-list/tenants-list/tenants-list';
import { TenantDetail } from './tenants/tenant-detail/tenant-detail/tenant-detail';
import { UsersList } from './users/users-list/users-list/users-list';
import { UserDetail } from './users/user-detail/user-detail/user-detail';
import { TenantMembershipsList } from './tenant-memberships/tenant-memberships-list/tenant-memberships-list/tenant-memberships-list';
import { TenantMembershipDetail } from './tenant-memberships/tenant-membership-detail/tenant-membership-detail/tenant-membership-detail';
import { RoleGuard } from '../../core/guards/role-guard';

export const IDENTITY_ROUTES: Routes = [
  // TENANTS
  {
    path: 'tenants',
    canActivate: [RoleGuard],
    data: { roles: ['SuperAdmin', 'TenantAdmin'] },
    children: [
      { path: '', component: TenantsList },
      { path: ':id', component: TenantDetail }
    ]
  },

  // USERS
  {
    path: 'users',
    canActivate: [RoleGuard],
    data: { roles: ['SuperAdmin'] },
    children: [
      { path: '', component: UsersList },
      { path: ':id', component: UserDetail }
    ]
  },

  // USER x TENANT MEMBERSHIPS
  {
    path: 'tenant-memberships',
    canActivate: [RoleGuard],
    data: { roles: ['SuperAdmin'] },
    children: [
      { path: '', component: TenantMembershipsList },
      // detalhe recebe userId e tenantId
      { path: ':userId/:tenantId', component: TenantMembershipDetail }
    ]
  },

  { path: '', redirectTo: 'tenants', pathMatch: 'full' }
];
