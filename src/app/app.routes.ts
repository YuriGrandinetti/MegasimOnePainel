// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthLayout } from './core/layout/auth-layout/auth-layout/auth-layout';
import { MainLayout } from './core/layout/main-layout/main-layout/main-layout';
import { AuthGuard } from './core/guards/auth-guard';

export const appRoutes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/identity/identity.routes').then(m => m.IDENTITY_ROUTES)
  },
  { path: '**', redirectTo: '' }
];

