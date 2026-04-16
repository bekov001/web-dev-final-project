import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category, Market, Trade } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories/`).pipe(
      catchError(this.handleError)
    );
  }

  // Markets
  getMarkets(categoryId?: number): Observable<Market[]> {
    let url = `${this.baseUrl}/markets/`;
    if (categoryId) {
      url += `?category_id=${categoryId}`;
    }
    return this.http.get<Market[]>(url).pipe(catchError(this.handleError));
  }

  getMarket(id: number): Observable<Market> {
    return this.http.get<Market>(`${this.baseUrl}/markets/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  createMarket(data: any): Observable<Market> {
    return this.http.post<Market>(`${this.baseUrl}/markets/`, data).pipe(
      catchError(this.handleError)
    );
  }

  updateMarket(id: number, data: any): Observable<Market> {
    return this.http.put<Market>(`${this.baseUrl}/markets/${id}/`, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteMarket(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/markets/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  // Trades
  getTrades(marketId: number): Observable<Trade[]> {
    return this.http.get<Trade[]>(`${this.baseUrl}/trades/?market_id=${marketId}`).pipe(
      catchError(this.handleError)
    );
  }

  createTrade(data: any): Observable<Trade> {
    return this.http.post<Trade>(`${this.baseUrl}/trades/`, data).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status === 400) {
      errorMessage = 'Invalid data';
    } else if (error.status === 404) {
      errorMessage = 'Not found';
    } else if (error.status === 0) {
      errorMessage = 'Server is not running';
    }
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
