import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Product } from '../models/product';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class Api {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // 👇 ИСПРАВЛЕННЫЙ ЛОГИН
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login/`, credentials).pipe(
      tap((response: any) => {
        if (response.access) {
          localStorage.setItem('access_token', response.access);
          if (response.refresh) {
            localStorage.setItem('refresh_token', response.refresh);
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  // 👇 ИСПРАВЛЕННАЯ РЕГИСТРАЦИЯ
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register/`, data).pipe(
      catchError(this.handleError)
    );
  }

  // 👇 ДОБАВЛЯЮ ВОССТАНОВЛЕНИЕ ПАРОЛЯ
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/password-reset/`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/`).pipe(
      catchError(this.handleError)
    );
  }

  getMyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/my-products/`).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  getProduct(id: string | null): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  // 👇 ДОБАВЛЯЮ ОБРАБОТЧИК ОШИБОК
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Произошла ошибка';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.status === 400) {
        errorMessage = 'Неверные данные';
        if (error.error) {
          // Django возвращает ошибки валидации
          const errors = Object.values(error.error);
          errorMessage = errors.join(', ');
        }
      } else if (error.status === 401) {
        errorMessage = 'Неверный email или пароль';
      } else if (error.status === 403) {
        errorMessage = 'Доступ запрещен';
      } else if (error.status === 404) {
        errorMessage = 'Сервер не найден';
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }




  // Добавь в класс Api
  // Добавь этот метод в класс Api
  createProduct(productData: any): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products/`, productData).pipe(
      catchError(this.handleError)
    );
  }



  // В классе Api
  updateProduct(id: number, data: any): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/products/${id}/`, data).pipe(
      catchError(this.handleError)
    );
  }
}