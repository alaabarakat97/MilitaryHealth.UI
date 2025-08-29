import { HttpInterceptorFn } from '@angular/common/http';
import { throwError, switchMap, catchError } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  const http = inject(HttpClient);

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) return throwError(() => err);

        return http.post<{ accessToken: string }>('api/auth/refresh', { refreshToken }).pipe(
          switchMap(res => {
            localStorage.setItem('access_token', res.accessToken);
            const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${res.accessToken}` } });
            return next(retryReq);
          }),
          catchError(() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return throwError(() => err);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
