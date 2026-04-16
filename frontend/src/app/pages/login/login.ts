import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  doLogin() {
    this.errorMessage = '';
    this.auth.login(this.username.trim(), this.password).subscribe({
      next: (user) => {
        if (user.is_moderator_or_admin) {
          this.router.navigate(['/pending']);
          return;
        }
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = 'Invalid credentials';
        this.cdr.detectChanges();
      },
    });
  }
}
