import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Product } from '../../models/product';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './my-products.html',
  styleUrl: './my-products.css',
})
export class MyProducts implements OnInit {
  // Товары
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  
  // Состояния
  showSold: boolean = false; // в классе
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Поиск и фильтры
  searchQuery: string = '';
  selectedCategoryId: number | null = null;
  sortBy: string = 'date_desc';
  
  // 👇 ДАННЫЕ ПОЛЬЗОВАТЕЛЯ (для профиля)
  userProfile: {
    full_name: string;
    email: string;
    avatar?: string;
    memberSince?: string;
  } = {
    full_name: '',
    email: '',
    avatar: '',
    memberSince: ''
  };
  
  // Статистика
  stats = {
    total: 0,
    active: 0,
    sold: 0
  };
  
  // Режим редактирования профиля
  isEditingProfile: boolean = false;
  editProfileData = {
    full_name: '',
    avatar: ''
  };
  
  // Категории
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
    private apiService: Api,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadMyProducts();
  }

  // Загрузка профиля пользователя (из localStorage или API)
  loadUserProfile() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userProfile.full_name = user.full_name || '';
        this.userProfile.email = user.email || '';
        this.userProfile.avatar = user.avatar || '';
        this.userProfile.memberSince = user.memberSince || this.getFormattedDate(new Date());
        
        // Для редактирования
        this.editProfileData.full_name = this.userProfile.full_name;
        this.editProfileData.avatar = this.userProfile.avatar || '';
      } catch (e) {
        console.error('Ошибка загрузки профиля', e);
      }
    } else {
      // Заглушка, если данных нет
      this.userProfile.full_name = 'Пользователь KBTU';
      this.userProfile.email = 'user@kbtu.kz';
    }
  }

  loadMyProducts() {
    this.isLoading = true;
    this.errorMessage = '';
    
    if (!this.apiService.isLoggedIn()) {
      this.errorMessage = 'Пожалуйста, войдите в систему чтобы увидеть свой профиль';
      this.isLoading = false;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    this.apiService.getMyProducts().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.updateStats(); // Обновляем статистику
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Ошибка при загрузке товаров';
        console.error('Ошибка загрузки моих товаров', err);
      }
    });
  }

  // Обновление статистики
  updateStats() {
  this.stats.total = this.allProducts.length;
  this.stats.active = this.allProducts.filter(p => !p.is_sold).length;
  this.stats.sold = this.allProducts.filter(p => p.is_sold).length;
}

  applyFilters() {
    let result = [...this.allProducts];
    
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(product => 
        product.name?.toLowerCase().includes(query)
      );
    }
    
    if (this.selectedCategoryId !== null) {
      result = result.filter(product => 
        product.category_id === this.selectedCategoryId
      );
    }

    if (!this.showSold) {
    result = result.filter(p => !p.is_sold);
  }
    
    result = this.sortProducts(result);
    this.filteredProducts = result;
  }

  sortProducts(products: Product[]): Product[] {
    switch (this.sortBy) {
      case 'price_asc':
        return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_desc':
        return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'name_asc':
        return [...products].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'date_desc':
      default:
        return [...products];
    }
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategoryId = null;
    this.sortBy = 'date_desc';
    this.applyFilters();
  }

  getCategoryName(categoryId?: number): string {
    if (!categoryId) return '';
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? `${cat.icon} ${cat.name}` : '';
  }

  // Редактирование профиля
  toggleEditProfile() {
    this.isEditingProfile = !this.isEditingProfile;
    if (this.isEditingProfile) {
      this.editProfileData.full_name = this.userProfile.full_name;
      this.editProfileData.avatar = this.userProfile.avatar || '';
    }
  }

  saveProfile() {
    // Сохраняем изменения
    this.userProfile.full_name = this.editProfileData.full_name;
    this.userProfile.avatar = this.editProfileData.avatar;
    
    // Обновляем localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.full_name = this.editProfileData.full_name;
      user.avatar = this.editProfileData.avatar;
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    this.isEditingProfile = false;
    this.successMessage = 'Профиль обновлен!';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
    
    // TODO: Отправить обновление на бэкенд (если есть эндпоинт)
  }

  getFormattedDate(date: Date): string {
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  removeProduct(id: number) {
    if (confirm('Вы уверены, что хотите удалить это объявление?')) {
      this.apiService.deleteProduct(id).subscribe({
        next: () => {
          this.allProducts = this.allProducts.filter(p => p.id !== id);
          this.updateStats();
          this.applyFilters();
          this.successMessage = 'Товар успешно удален';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Не удалось удалить товар';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  logout() {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }

  markAsSold(id: number) {
    if (confirm('Отметить товар как проданный? Он исчезнет из витрины.')) {
      this.apiService.updateProduct(id, { is_sold: true }).subscribe({
        next: () => {
          // Обновляем локальный список
          const product = this.allProducts.find(p => p.id === id);
          if (product) {
            product.is_sold = true;
          }
          this.updateStats();
          this.applyFilters();
          this.successMessage = 'Товар отмечен как проданный';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Не удалось отметить товар';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}