import { Routes } from '@angular/router';
import { TenantsListComponent } from './tenants/tenants-list/tenants-list.component';
import { TenantDetailComponent } from './tenants/tenant-detail/tenant-detail.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { TenantMembershipsListComponent } from './tenant-memberships/tenant-memberships-list/tenant-memberships-list.component';
import { TenantMembershipDetailComponent } from './tenant-memberships/tenant-membership-detail/tenant-membership-detail.component';

export const IDENTITY_ROUTES: Routes = [
  {
    path: 'tenants',
    children: [
      { path: '', component: TenantsListComponent },
      { path: ':id', component: TenantDetailComponent }
    ]
  },
  {
    path: 'users',
    children: [
      { path: '', component: UsersListComponent },
      { path: ':id', component: UserDetailComponent }
    ]
  },
  {
    path: 'tenant-memberships',
    children: [
      { path: '', component: TenantMembershipsListComponent },
      { path: ':id', component: TenantMembershipDetailComponent }
    ]
  },
  { path: '', redirectTo: 'tenants', pathMatch: 'full' }
];