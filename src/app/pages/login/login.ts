import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginData = {
    email: '',      // 👈 ИЗМЕНИЛА С username НА email
    password: ''
  };

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private apiService: Api, private router: Router) {}

  onLogin() {
    // Проверка на пустые поля
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Заполните все поля';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Успешный вход!', res);
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Неверный email или пароль';
        console.error('Ошибка входа:', err);
      }
    });
  }

  forgotPassword() {
    // TODO: открыть модалку или перейти на страницу восстановления
    console.log('Забыли пароль');
  }
}