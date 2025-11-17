import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO: pegar access_token do AuthStoreService
  // const token = ...
  // const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  // return next(authReq);

  return next(req);
};
