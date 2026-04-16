import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'KBTU Predict';

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.auth.refreshMe().subscribe({
      error: () => this.auth.logout(),
    });
  }

  logout() {
    this.auth.logout();
  }
}
