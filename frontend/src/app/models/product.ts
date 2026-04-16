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
  approved: boolean;
  approved_at: string | null;
  approved_by_name: string | null;
}

export interface Trade {
  id: number;
  market: number;
  trader_name: string;
  choice: boolean;
  created_at: string;
}

export interface CurrentUser {
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_moderator_or_admin: boolean;
}
