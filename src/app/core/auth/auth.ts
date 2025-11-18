import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Modelo do usuário autenticado usado no front.
// Se você já tiver um UserIdentity mais completo, pode substituir aqui.
export interface AuthUser {
  id: string;
  userName?: string;
  email?: string;

  tenantId?: string;
  tenantName?: string;

  roles?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class Auth {

  // subject interno
  private readonly _user$ = new BehaviorSubject<AuthUser | null>(null);

  // observable que o resto da app usa
  readonly user$: Observable<AuthUser | null> = this._user$.asObservable();

  // acesso síncrono (se precisar)
  get currentUser(): AuthUser | null {
    return this._user$.value;
  }

  // chamado depois do login / refresh / switch-tenant
  setUser(user: AuthUser | null): void {
    this._user$.next(user);
  }

  // chamado no logout
  clear(): void {
    this._user$.next(null);
  }
}
