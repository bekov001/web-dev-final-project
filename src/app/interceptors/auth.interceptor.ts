import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 1. Извлекаем токен из localStorage
    const token = localStorage.getItem('access_token');

    // 2. Если токен есть, "клонируем" запрос и добавляем заголовок Authorization
    if (token) {
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      // 3. Отправляем измененный запрос дальше
      return next.handle(authReq);
    }

    // Если токена нет, отправляем оригинальный запрос (например, для Login)
    return next.handle(request);
  }
}