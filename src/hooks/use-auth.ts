import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Mock types for development
type User = {
  id: string;
  email?: string;
  created_at: string;
};

type Session = {
  user: User;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For development, create a mock user
    const mockUser: User = {
      id: 'mock-user-id',
      email: 'user@example.com',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Set mock user immediately for development
    setUser(mockUser);
    setSession({ user: mockUser });
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock sign in for development
    console.log('Mock sign in:', email);
    return { data: null, error: { message: 'Authentication is disabled in development mode' } };
  };

  const signUp = async (email: string, password: string) => {
    // Mock sign up for development
    console.log('Mock sign up:', email);
    return { data: null, error: { message: 'Authentication is disabled in development mode' } };
  };

  const signOut = async () => {
    // Mock sign out for development
    console.log('Mock sign out');
    return { error: null };
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
};