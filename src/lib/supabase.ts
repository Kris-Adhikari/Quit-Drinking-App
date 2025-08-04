// DEVELOPMENT MODE: Supabase is disabled
// To enable Supabase, set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file

// Mock Supabase client for development
const createMockSupabaseClient = () => {
  const mockAuth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signUp: async () => ({ data: null, error: { message: 'Supabase is disabled in development mode' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase is disabled in development mode' } }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: (callback: any) => {
      // Return mock unsubscribe function
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  };

  const mockFrom = (table: string) => {
    const chainableMethods = {
      select: () => chainableMethods,
      insert: () => chainableMethods,
      update: () => chainableMethods,
      delete: () => chainableMethods,
      upsert: () => chainableMethods,
      eq: () => chainableMethods,
      neq: () => chainableMethods,
      gt: () => chainableMethods,
      gte: () => chainableMethods,
      lt: () => chainableMethods,
      lte: () => chainableMethods,
      like: () => chainableMethods,
      ilike: () => chainableMethods,
      is: () => chainableMethods,
      in: () => chainableMethods,
      contains: () => chainableMethods,
      containedBy: () => chainableMethods,
      order: () => chainableMethods,
      limit: () => chainableMethods,
      single: () => chainableMethods,
      maybeSingle: () => chainableMethods,
      then: (resolve: any) => resolve({ data: [], error: null }),
    };
    return chainableMethods;
  };

  return {
    auth: mockAuth,
    from: mockFrom,
  };
};

export const supabase = createMockSupabaseClient() as any;

console.log('🔧 Supabase is disabled for development. All database operations will be mocked.');

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