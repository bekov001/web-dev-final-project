import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  // Все товары с сервера
  allProducts: Product[] = [];
  
  // Отфильтрованные товары (показываем пользователю)
  filteredProducts: Product[] = [];
  
  // Состояния
  isLoading: boolean = true;
  error: string = '';
  
  // Поиск и фильтры
  searchQuery: string = '';
  selectedCategoryId: number | null = null;
  
  // 👇 Категории (фиксированные, позже можно получать с бэкенда)
  categories: { id: number; name: string; icon: string }[] = [
    { id: 1, name: 'Учебники и книги', icon: '📚' },
    { id: 2, name: 'Электроника', icon: '💻' },
    { id: 3, name: 'Канцелярия', icon: '📝' },
    { id: 4, name: 'Одежда', icon: '👕' },
    { id: 5, name: 'Игры', icon: '🎮' },
    { id: 6, name: 'Мебель', icon: '🪑' },
    { id: 7, name: 'Разное', icon: '🏠' }
  ];

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.error = '';
    
    this.api.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.applyFilters(); // Применяем фильтры после загрузки
        this.isLoading = false;
        this.error = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Ошибка загрузки товаров. Убедитесь, что бэкенд запущен.';
        console.error('API Error:', err);
      }
    });
  }

  // Применяем фильтры и поиск
  applyFilters(): void {
    let result = [...this.allProducts];
    
    // 1. Поиск по названию
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(product => 
        product.name?.toLowerCase().includes(query)
      );
    }
    
    // 2. Фильтр по категории
    if (this.selectedCategoryId !== null) {
      result = result.filter(product => 
        product.category_id === this.selectedCategoryId
      );
    }
    
    this.filteredProducts = result;
  }

  // Обновляем фильтры (вызывается при изменении поиска/категории)
  onFilterChange(): void {
    this.applyFilters();
  }

  // Сбросить все фильтры
  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategoryId = null;
    this.applyFilters();
  }

  // Получить название категории по id (для отображения в карточке, если нужно)
  getCategoryName(categoryId?: number): string {
    if (!categoryId) return '';
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? `${cat.icon} ${cat.name}` : '';
  }
}