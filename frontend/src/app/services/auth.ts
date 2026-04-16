import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { CurrentUser } from '../models/product';
import { Api } from './api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authStorageKey = 'kbtu_basic_auth';
  private readonly userStorageKey = 'kbtu_current_user';

  private userSubject = new BehaviorSubject<CurrentUser | null>(this.loadStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(private api: Api) {}

  get authHeader(): string | null {
    return localStorage.getItem(this.authStorageKey);
  }

  get currentUser(): CurrentUser | null {
    return this.userSubject.value;
  }

  get isModeratorOrAdmin(): boolean {
    return this.currentUser?.is_moderator_or_admin ?? false;
  }

  login(username: string, password: string): Observable<CurrentUser> {
    const raw = `${username}:${password}`;
    const authHeader = `Basic ${btoa(raw)}`;
    localStorage.setItem(this.authStorageKey, authHeader);
    return this.api.getCurrentUser().pipe(
      tap((user) => {
        this.userSubject.next(user);
        localStorage.setItem(this.userStorageKey, JSON.stringify(user));
      })
    );
  }

  refreshMe(): Observable<CurrentUser | null> {
    if (!this.authHeader) {
      this.logout();
      return of(null);
    }
    return this.api.getCurrentUser().pipe(
      tap((user) => {
        this.userSubject.next(user);
        localStorage.setItem(this.userStorageKey, JSON.stringify(user));
      })
    );
  }

  logout() {
    localStorage.removeItem(this.authStorageKey);
    localStorage.removeItem(this.userStorageKey);
    this.userSubject.next(null);
  }

  private loadStoredUser(): CurrentUser | null {
    const raw = localStorage.getItem(this.userStorageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CurrentUser;
    } catch {
      localStorage.removeItem(this.userStorageKey);
      return null;
    }
  }
}
