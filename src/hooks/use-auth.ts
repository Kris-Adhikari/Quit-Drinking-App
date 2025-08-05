import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have Supabase configured
    const isSupabaseConfigured = process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!isSupabaseConfigured) {
      // For development without Supabase, create a mock user
      const mockUser = {
        id: 'mock-user-id',
        email: 'user@example.com',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
      } as User;

      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      setLoading(false);
      return;
    }

    // Real Supabase authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOAuth = async (provider: 'google' | 'apple' | 'github') => {
    const isSupabaseConfigured = process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!isSupabaseConfigured) {
      console.log('Mock OAuth sign in:', provider);
      return { data: null, error: { message: 'Authentication is disabled in development mode' } };
    }
    
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin, // Supabase handles the redirect
        skipBrowserRedirect: true, // Important for React Native
      },
    });
  };

  const signIn = async (email: string, password: string) => {
    const isSupabaseConfigured = process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!isSupabaseConfigured) {
      console.log('Mock sign in:', email);
      return { data: null, error: { message: 'Authentication is disabled in development mode' } };
    }
    
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string) => {
    const isSupabaseConfigured = process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!isSupabaseConfigured) {
      console.log('Mock sign up:', email);
      return { data: null, error: { message: 'Authentication is disabled in development mode' } };
    }
    
    return await supabase.auth.signUp({ email, password });
  };

  const signOut = async () => {
    const isSupabaseConfigured = process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!isSupabaseConfigured) {
      console.log('Mock sign out');
      return { error: null };
    }
    
    return await supabase.auth.signOut();
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
  };
};