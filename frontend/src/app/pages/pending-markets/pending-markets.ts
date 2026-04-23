import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Market } from '../../models/product';

@Component({
  selector: 'app-pending-markets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pending-markets.html',
  styleUrl: './pending-markets.css',
})
export class PendingMarkets implements OnInit {
  markets: Market[] = [];
  awaiting: Market[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(
    private api: Api,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPending();
    this.loadAwaiting();
  }

  loadPending() {
    this.api.getPendingMarkets().subscribe({
      next: (data) => {
        this.markets = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.cdr.detectChanges();
      },
    });
  }

  loadAwaiting() {
    this.api.getAwaitingResolutionMarkets().subscribe({
      next: (data) => {
        this.awaiting = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.cdr.detectChanges();
      },
    });
  }

  approveMarket(marketId: number) {
    this.successMessage = '';
    this.errorMessage = '';
    this.api.approveMarket(marketId).subscribe({
      next: () => {
        this.successMessage = 'Market approved.';
        this.loadPending();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.cdr.detectChanges();
      },
    });
  }

  resolveMarket(marketId: number, outcome: boolean) {
    this.successMessage = '';
    this.errorMessage = '';
    this.api.resolveMarket(marketId, outcome).subscribe({
      next: () => {
        this.successMessage = `Market resolved as ${outcome ? 'YES' : 'NO'}.`;
        this.loadAwaiting();
      },
      error: (err) => {
        this.errorMessage = err.error?.detail ?? err.message;
        this.cdr.detectChanges();
      },
    });
  }
}
