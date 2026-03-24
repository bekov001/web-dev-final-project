import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Api } from './services/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('marketplace');

  constructor(
    private apiService: Api,
    private router: Router
  ) {}

  // Проверка авторизации
  isLoggedIn(): boolean {
    return this.apiService.isLoggedIn();
  }

  // Выход
  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}