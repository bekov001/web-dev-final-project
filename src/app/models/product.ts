export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;      // URL картинки (например, "http://localhost:8000/media/calc.jpg")
  category_id?: number; // Знак '?' значит, что поле необязательное
  condition: string;
  is_sold?: boolean;
}