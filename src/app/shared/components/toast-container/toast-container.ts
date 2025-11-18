import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Notification, AppToast } from '../../../core/services/notification';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.html',
  styleUrls: ['./toast-container.scss']
})
export class ToastContainer implements OnInit, OnDestroy {

  toasts: AppToast[] = [];
  private sub?: Subscription;

  constructor(private notification: Notification) {}

  ngOnInit(): void {
    this.sub = this.notification.toasts$.subscribe(list => {
      this.toasts = list;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  close(toast: AppToast): void {
    this.notification.remove(toast.id);
  }

  cssClass(toast: AppToast): string {
    switch (toast.type) {
      case 'success': return 'toast-success';
      case 'error': return 'toast-error';
      case 'warning': return 'toast-warning';
      case 'info':
      default: return 'toast-info';
    }
  }
}
