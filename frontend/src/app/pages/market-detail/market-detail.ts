import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Market, Trade } from '../../models/product';

@Component({
  selector: 'app-market-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './market-detail.html',
  styleUrl: './market-detail.css'
})
export class MarketDetail implements OnInit {
  market: Market | null = null;
  trades: Trade[] = [];
  errorMessage: string = '';

  constructor(
    private api: Api,
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMarket(id);
    this.loadTrades(id);
  }

  loadMarket(id: number) {
    this.api.getMarket(id).subscribe({
      next: (data) => {
        this.market = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.cdr.detectChanges();
      }
    });
  }

  loadTrades(id: number) {
    this.api.getTrades(id).subscribe({
      next: (data) => {
        this.trades = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.errorMessage = err.message
    });
  }

  placeTrade(choice: boolean) {
    if (!this.market || !this.market.approved) return;

    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/auth']);
      return;
    }

    this.api.createTrade({
      market: this.market.id,
      choice: choice
    }).subscribe({
      next: () => {
        this.loadMarket(this.market!.id);
        this.loadTrades(this.market!.id);
        this.auth.loadProfile();
        this.errorMessage = '';
      },
      error: (err) => {
        if (err.error?.detail) {
          this.errorMessage = err.error.detail;
        } else {
          this.errorMessage = err.message;
        }
        this.cdr.detectChanges();
      }
    });
  }

  get canPlaceTrade() {
    return this.market?.approved ?? false;
  }

  deleteMarket() {
    if (!this.market) return;
    this.api.deleteMarket(this.market.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.errorMessage = err.message;
        this.cdr.detectChanges();
      }
    });
  }
}
