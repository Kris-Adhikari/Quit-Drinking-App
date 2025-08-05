export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          drinking_history: string | null
          quit_goal: string | null
          daily_limit: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          drinking_history?: string | null
          quit_goal?: string | null
          daily_limit?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          drinking_history?: string | null
          quit_goal?: string | null
          daily_limit?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      alcohol_logs: {
        Row: {
          id: string
          user_id: string
          amount: number
          drink_type: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          drink_type: string
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          drink_type?: string
          timestamp?: string
          created_at?: string
        }
      }
      onboarding_data: {
        Row: {
          user_id: string
          completed_steps: string[]
          triggers: string[]
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          completed_steps?: string[]
          triggers?: string[]
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          completed_steps?: string[]
          triggers?: string[]
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_streaks: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          longest_streak: number
          last_check_in: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_check_in?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_check_in?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}