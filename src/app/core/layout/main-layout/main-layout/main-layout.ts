// src/app/core/layout/main-layout/main-layout.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Auth store + serviço
import { Auth } from '../../../auth/auth';
import { AuthService } from '../../../auth/auth.service';

// Shared UI
import { TenantSwitcher } from '../../../../shared/components/tenant-switcher/tenant-switcher/tenant-switcher';
import { ToastContainer } from '../../../../shared/components/toast-container/toast-container';
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TenantSwitcher,
    ToastContainer
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayout {

  // exposto pro template: (user$ | async) as user
  // virou um GETTER pra não usar o auth antes do construtor
  get user$() {
    return this.auth.user$;
  }

  constructor(
    private auth: Auth,
    private authService: AuthService
  ) { }

  onLogout(): void {
    this.authService.logout();
  }
}

