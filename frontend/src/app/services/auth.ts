import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface UserProfile {
  username: string;
  points: number;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: UserProfile;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api/auth';
  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.getToken()) {
      this.loadProfile();
    }
  }

  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

  get currentUser(): UserProfile | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  register(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/`, { username, password }).pipe(
      tap(res => this.setSession(res))
    );
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login/`, { username, password }).pipe(
      tap(res => this.setSession(res))
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.userSubject.next(null);
  }

  loadProfile() {
    this.http.get<UserProfile>(`${this.baseUrl}/me/`).subscribe({
      next: (profile) => this.userSubject.next(profile),
      error: () => this.logout(),
    });
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem('access_token', res.access);
    localStorage.setItem('refresh_token', res.refresh);
    if (res.user) {
      this.userSubject.next(res.user);
    } else {
      this.loadProfile();
    }
  }
}
