import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { Product } from '../../models/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  imports: [FormsModule, CommonModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create {
  // Данные товара с category_id (число)
  newProduct: Partial<Product> = {
    name: '',
    price: 0,
    description: '',
    image: '',
    condition: 'New',
    category_id: undefined  // 👈 добавляем category_id
  };

  // Для фото
  photoType: 'url' | 'file' = 'url';
  photoUrl: string = '';
  selectedFile: File | null = null;
  filePreviewUrl: string = '';

  // Состояние
  message: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  // 👇 Категории (такие же, как в my-products)
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

  clearPhotoData() {
    this.photoUrl = '';
    this.clearFile();
  }

  clearFile() {
    this.selectedFile = null;
    if (this.filePreviewUrl) {
      URL.revokeObjectURL(this.filePreviewUrl);
      this.filePreviewUrl = '';
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      if (this.filePreviewUrl) {
        URL.revokeObjectURL(this.filePreviewUrl);
      }
      this.filePreviewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  onImageError() {
    console.log('Не удалось загрузить изображение по ссылке');
  }

  prepareProductData(): any {
    const productData = {
      name: this.newProduct.name,
      price: this.newProduct.price,
      description: this.newProduct.description,
      condition: this.newProduct.condition,
      category_id: this.newProduct.category_id  // 👈 добавляем category_id
    };

    if (this.photoType === 'url') {
      return {
        ...productData,
        image: this.photoUrl
      };
    } else {
      // Заглушка для файлов
      console.warn('Загрузка файлов пока не настроена на бэкенде. Используйте ссылку.');
      this.errorMessage = 'Загрузка файлов временно недоступна. Пожалуйста, используйте ссылку на фото.';
      return null;
    }
  }

  submitProduct() {
    // Валидация
    if (!this.newProduct.name || !this.newProduct.price) {
      this.errorMessage = 'Пожалуйста, заполните название и цену!';
      return;
    }

    if (this.newProduct.price <= 0) {
      this.errorMessage = 'Цена должна быть больше 0!';
      return;
    }

    // Проверка фото
    if (this.photoType === 'url' && !this.photoUrl) {
      this.errorMessage = 'Пожалуйста, добавьте ссылку на фото!';
      return;
    }

    if (this.photoType === 'file' && !this.selectedFile) {
      this.errorMessage = 'Пожалуйста, выберите фото!';
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    const productData = this.prepareProductData();
    
    if (!productData) {
      this.isLoading = false;
      return;
    }

    console.log('Отправка товара:', productData);

    this.apiService.createProduct(productData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.message = 'Товар успешно опубликован!';
        
        // Очищаем форму
        this.newProduct = {
          name: '',
          price: 0,
          description: '',
          image: '',
          condition: 'New',
          category_id: undefined
        };
        this.photoUrl = '';
        this.clearFile();
        this.photoType = 'url';
        
        setTimeout(() => {
          this.router.navigate(['/my-products']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Ошибка при создании товара';
        console.error('Ошибка:', err);
      }
    });
  }
}