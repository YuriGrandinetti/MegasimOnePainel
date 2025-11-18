// src/app/core/interceptors/error-interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP error', error);
      // aqui você pode tratar o erro (toast, redirect, etc.)
      return throwError(() => error);
    })
  );
};

