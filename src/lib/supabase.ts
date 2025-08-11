import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Mock Supabase client for development
const createMockSupabaseClient = () => {
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
    from: mockFrom,
  };
};

// Create Supabase client - using anon key with application-level security
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : createMockSupabaseClient() as any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('🔧 Supabase is disabled for development. All database operations will be mocked.');
  console.log('💡 To enable Supabase, add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file');
}

