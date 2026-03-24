import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  product: Product | undefined;
  isLoading: boolean = true;
  errorMessage: string = '';
  
  // Категории (для отображения названия)
  categories: { id: number; name: string; icon: string }[] = [
    { id: 1, name: 'Учебники и книги', icon: '📚' },
    { id: 2, name: 'Электроника', icon: '💻' },
    { id: 3, name: 'Канцелярия', icon: '📝' },
    { id: 4, name: 'Одежда', icon: '👕' },
    { id: 5, name: 'Игры', icon: '🎮' },
    { id: 6, name: 'Мебель', icon: '🪑' },
    { id: 7, name: 'Разное', icon: '🏠' }
  ];

  constructor(
    private route: ActivatedRoute,
    private apiService: Api
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.errorMessage = 'ID товара не указан';
      this.isLoading = false;
      return;
    }

    this.apiService.getProduct(id).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Товар не найден';
        console.error('Ошибка загрузки товара:', err);
      }
    });
  }

  // Получить название категории
  getCategoryName(categoryId?: number): string {
    if (!categoryId) return 'Не указана';
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? `${cat.icon} ${cat.name}` : 'Не указана';
  }

  // Получить состояние на русском
  getConditionText(condition: string): string {
    return condition === 'New' ? 'Новый' : 'Б/У';
  }

  contactSeller() {
    alert('Связаться с продавцом можно по почте или в Telegram (в разработке)');
  }
}