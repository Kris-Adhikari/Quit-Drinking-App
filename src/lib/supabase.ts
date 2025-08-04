import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// For development, we'll create a placeholder client if keys are not set
const isPlaceholder = supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

if (isPlaceholder) {
  console.warn('⚠️ Supabase is running with placeholder values. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file');
}

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          drinking_history: string | null;
          quit_goal: string | null;
          daily_limit: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          drinking_history?: string | null;
          quit_goal?: string | null;
          daily_limit?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          drinking_history?: string | null;
          quit_goal?: string | null;
          daily_limit?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      alcohol_logs: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          drink_type: string;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          drink_type: string;
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          drink_type?: string;
          timestamp?: string;
          created_at?: string;
        };
      };
      onboarding_data: {
        Row: {
          user_id: string;
          completed_steps: string[];
          triggers: string[];
          preferences: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          completed_steps?: string[];
          triggers?: string[];
          preferences?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          completed_steps?: string[];
          triggers?: string[];
          preferences?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};