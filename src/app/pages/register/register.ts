import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerData = {
    email: '',
    password: '',
    password2: '',  // Django ожидает password2
    full_name: ''
  };

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private apiService: Api, private router: Router) {}

  onRegister() {
    if (!this.registerData.email || !this.registerData.password || !this.registerData.password2) {
      this.errorMessage = 'Заполните все обязательные поля';
      return;
    }

    if (this.registerData.password !== this.registerData.password2) {
      this.errorMessage = 'Пароли не совпадают';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.register(this.registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Регистрация успешна! Теперь вы можете войти.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Ошибка регистрации';
      }
    });
  }
}