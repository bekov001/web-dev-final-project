import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const authHeader = auth.authHeader;
  if (!authHeader) {
    return next(req);
  }

  const requestWithAuth = req.clone({
    setHeaders: {
      Authorization: authHeader,
    },
  });

  return next(requestWithAuth).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Stale/invalid stored credentials should not break public pages.
        auth.logout();
        if (req.method === 'GET') {
          return next(req);
        }
      }
      return throwError(() => error);
    })
  );
};
