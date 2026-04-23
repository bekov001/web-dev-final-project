import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Market, Category } from '../../models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  markets: Market[] = [];
  filteredMarkets: Market[] = [];
  categories: Category[] = [];
  selectedCategory: number = 0;
  searchQuery: string = '';
  errorMessage: string = '';
  isLoading: boolean = true;
  activeTab: 'active' | 'resolved' = 'active';
  today = new Date();

  constructor(private api: Api, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCategories();
    this.loadMarkets();
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.errorMessage = err.message
    });
  }

  loadMarkets() {
    this.isLoading = true;
    this.api.getMarkets(undefined, this.activeTab).subscribe({
      next: (data) => {
        this.markets = data;
        this.isLoading = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectTab(tab: 'active' | 'resolved') {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.loadMarkets();
  }

  filterByCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  applyFilters() {
    let result = this.markets;
    if (this.selectedCategory > 0) {
      result = result.filter(m => m.category === this.selectedCategory);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(m => m.title.toLowerCase().includes(q));
    }
    this.filteredMarkets = result;
  }

  onSearchChange() {
    this.applyFilters();
  }
}
