import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'callback', component: AuthCallbackComponent },
  { path: '**', redirectTo: 'login' }
];