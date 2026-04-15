export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface Market {
  id: number;
  title: string;
  description: string;
  category: number;
  category_name: string;
  created_at: string;
  end_date: string;
  is_resolved: boolean;
  resolved_outcome: boolean | null;
  image_url: string;
  yes_count: number;
  no_count: number;
  yes_percentage: number;
}

export interface Trade {
  id: number;
  market: number;
  trader_name: string;
  choice: boolean;
  created_at: string;
}
