import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { Category } from '../../models/product';

@Component({
  selector: 'app-create-market',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-market.html',
  styleUrl: './create-market.css'
})
export class CreateMarket implements OnInit {
  categories: Category[] = [];
  title: string = '';
  description: string = '';
  selectedCategory: number = 0;
  endDate: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  readonly minEndDate = this.toLocalInputValue(new Date(Date.now() + 60 * 60 * 1000));

  constructor(private api: Api, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.errorMessage = err.message
    });
  }

  createMarket() {
    if (!this.title.trim() || !this.description.trim() || !this.selectedCategory || !this.endDate) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.api.createMarket({
      title: this.title.trim(),
      description: this.description.trim(),
      category: this.selectedCategory,
      end_date: new Date(this.endDate).toISOString()
    }).subscribe({
      next: (market) => {
        this.router.navigate(['/markets', market.id]);
      },
      error: (err) => this.errorMessage = err.message
    });
  }

  private toLocalInputValue(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
