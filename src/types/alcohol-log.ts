export interface AlcoholLog {
  id: string;
  user_id: string;
  amount: number;
  drink_type: string;
  price?: number;
  calories?: number;
  alcohol_content?: number; // ABV percentage
  volume?: number; // in ml or oz
  notes?: string;
  timestamp: string;
  created_at: string;
}

export interface CustomDrink {
  id: string;
  user_id: string;
  name: string;
  emoji?: string;
  price: number;
  calories: number;
  alcohol_content: number; // ABV percentage
  volume: number; // in ml
  standard_drinks: number; // calculated from volume and ABV
  created_at: string;
}

export interface DailyTracking {
  date: string;
  total_drinks: number;
  logs: AlcoholLog[];
  is_alcohol_free: boolean;
}

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_drink_date: string | null;
  start_date: string;
}

export interface UserStats {
  total_days_tracked: number;
  alcohol_free_days: number;
  average_drinks_per_week: number;
  money_saved: number;
  calories_saved: number;
}