import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    // import { catchError } from 'rxjs/operators';
    // import { throwError } from 'rxjs';
    // TODO: implementar tratamento global (401 -> login; 403 -> acesso negado etc.)
  );
};

