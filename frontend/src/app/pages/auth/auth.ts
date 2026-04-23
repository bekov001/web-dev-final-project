import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  isLogin = true;
  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }

  submit() {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Fill in all fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const action = this.isLogin
      ? this.authService.login(this.username, this.password)
      : this.authService.register(this.username, this.password);

    action.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        if (err.error?.detail) {
          this.errorMessage = err.error.detail;
        } else if (err.error?.username) {
          this.errorMessage = err.error.username[0];
        } else if (err.error?.password) {
          this.errorMessage = err.error.password[0];
        } else {
          this.errorMessage = this.isLogin
            ? 'Invalid username or password'
            : 'Registration failed';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
