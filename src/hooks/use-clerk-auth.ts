import { useUser, useAuth as useClerkAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { useCallback, useEffect } from 'react';
import { normalizeUserId } from '@/lib/user-id-utils';
import { supabase } from '@/lib/supabase';

export const useAuth = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const { isLoaded: authLoaded, signOut, sessionId, getToken } = useClerkAuth();
  const { signIn, isLoaded: signInLoaded, setActive: setActiveSignIn } = useSignIn();
  const { signUp, isLoaded: signUpLoaded, setActive: setActiveSignUp } = useSignUp();

  const loading = !userLoaded || !authLoaded || !signInLoaded || !signUpLoaded;

  // Since we're using application-level security instead of RLS,
  // we don't need to set Supabase auth tokens
  // The user ID will be passed explicitly in queries

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!signIn) return { error: { message: 'Sign in not initialized' } };
    
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActiveSignIn({ session: result.createdSessionId });
        return { data: { user: result }, error: null };
      }

      return { data: { user: result }, error: null };
    } catch (err: any) {
      console.error('Sign in error:', err);
      return { 
        data: null, 
        error: { message: err.errors?.[0]?.message || 'Sign in failed' } 
      };
    }
  }, [signIn, setActiveSignIn]);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    if (!signUp) return { error: { message: 'Sign up not initialized' } };
    
    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      if (result.status === 'complete') {
        await setActiveSignUp({ session: result.createdSessionId });
        return { data: { user: result }, error: null };
      }

      if (result.status === 'missing_requirements') {
        return { 
          data: { user: result, verification: 'needed' }, 
          error: null 
        };
      }

      return { data: { user: result }, error: null };
    } catch (err: any) {
      console.error('Sign up error:', err);
      return { 
        data: null, 
        error: { message: err.errors?.[0]?.message || 'Sign up failed' } 
      };
    }
  }, [signUp, setActiveSignUp]);

  const signInAnonymously = useCallback(async () => {
    return { 
      data: null, 
      error: { message: 'Anonymous sign in not supported with Clerk. Please sign up or sign in.' } 
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      return { error: null };
    } catch (err: any) {
      console.error('Sign out error:', err);
      return { error: { message: 'Sign out failed' } };
    }
  }, [signOut]);

  return {
    user: user ? {
      id: normalizeUserId(user.id),
      email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
      created_at: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
      updated_at: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString(),
      app_metadata: {},
      user_metadata: {
        name: user.fullName || user.firstName || '',
        avatar_url: user.imageUrl,
      },
      aud: 'authenticated',
      role: 'authenticated',
    } : null,
    session: sessionId ? { 
      id: sessionId,
      user: user ? {
        id: normalizeUserId(user.id),
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
      } : null,
      access_token: sessionId,
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
    } : null,
    loading,
    isSignedIn,
    signIn: signInWithEmail,
    signUp: signUpWithEmail,
    signOut: handleSignOut,
    signInWithOAuth: async (provider: 'google' | 'apple' | 'github', redirectUrl?: string) => {
      return { 
        data: null, 
        error: { message: 'OAuth will be handled by Clerk components. Use ClerkSignIn component.' } 
      };
    },
    signInAnonymously,
  };
};