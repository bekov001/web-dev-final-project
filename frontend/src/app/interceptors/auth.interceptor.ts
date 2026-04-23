import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  if (!token) {
    return next(req);
  }

  const requestWithAuth = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(requestWithAuth).pipe(
    catchError((error) => {
      if (error.status === 401) {
        auth.logout();
        if (req.method === 'GET') {
          return next(req);
        }
      }
      return throwError(() => error);
    })
  );
};
