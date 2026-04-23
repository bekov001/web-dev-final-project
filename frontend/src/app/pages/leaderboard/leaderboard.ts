import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth';

interface LeaderboardRow {
  username: string;
  points: number;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard implements OnInit {
  rows: LeaderboardRow[] = [];
  errorMessage = '';
  isLoading = true;

  constructor(
    private api: Api,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.api.getLeaderboard().subscribe({
      next: (data) => {
        this.rows = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get myUsername(): string | null {
    return this.auth.currentUser?.username ?? null;
  }
}
