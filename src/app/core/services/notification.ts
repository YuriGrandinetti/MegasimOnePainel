import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppToast {
  id: number;
  type: NotificationType;
  message: string;
  title?: string;
  timeout?: number; // ms
}

@Injectable({
  providedIn: 'root'
})
export class Notification {

  private readonly _toasts = new BehaviorSubject<AppToast[]>([]);
  readonly toasts$ = this._toasts.asObservable();

  private counter = 0;

  private push(type: NotificationType, message: string, title?: string, timeout = 4000): void {
    const toast: AppToast = {
      id: ++this.counter,
      type,
      message,
      title,
      timeout
    };

    const list = this._toasts.value;
    this._toasts.next([...list, toast]);

    // auto remover depois de X ms
    if (timeout && timeout > 0) {
      setTimeout(() => this.remove(toast.id), timeout);
    }
  }

  remove(id: number): void {
    const list = this._toasts.value.filter(t => t.id !== id);
    this._toasts.next(list);
  }

  clear(): void {
    this._toasts.next([]);
  }

  success(message: string, title = 'Sucesso'): void {
    this.push('success', message, title);
  }

  error(message: string, title = 'Erro'): void {
    this.push('error', message, title, 6000);
  }

  info(message: string, title = 'Informação'): void {
    this.push('info', message, title);
  }

  warning(message: string, title = 'Atenção'): void {
    this.push('warning', message, title);
  }
}

