import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

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

// Create real Supabase client if credentials are provided, otherwise use mock
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : createMockSupabaseClient() as any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('🔧 Supabase is disabled for development. All database operations will be mocked.');
  console.log('💡 To enable Supabase, add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file');
}

