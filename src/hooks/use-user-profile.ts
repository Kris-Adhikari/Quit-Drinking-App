import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  age?: number;
  gender?: string;
  location?: string;
  relationship_status?: string;
  created_at?: string;
  updated_at?: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile from local storage or Supabase
  const loadProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Check if Supabase is configured
      const isSupabaseConfigured = process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      
      if (isSupabaseConfigured) {
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data && !error) {
          setProfile(data);
          // Cache locally
          await AsyncStorage.setItem('userProfile', JSON.stringify(data));
        } else if (error?.code === 'PGRST116') {
          // No profile found, check local storage
          const localProfile = await AsyncStorage.getItem('userProfile');
          if (localProfile) {
            setProfile(JSON.parse(localProfile));
          }
        }
      } else {
        // Supabase not configured, use local storage only
        const localProfile = await AsyncStorage.getItem('userProfile');
        if (localProfile) {
          setProfile(JSON.parse(localProfile));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to local storage
      const localProfile = await AsyncStorage.getItem('userProfile');
      if (localProfile) {
        setProfile(JSON.parse(localProfile));
      }
    } finally {
      setLoading(false);
    }
  };

  // Save or update profile
  const saveProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const isSupabaseConfigured = process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      
      const updatedProfile = {
        ...profile,
        ...profileData,
        user_id: user.id,
        id: profile?.id || user.id,
        updated_at: new Date().toISOString(),
      } as UserProfile;

      if (isSupabaseConfigured) {
        // Try to save to Supabase
        const { data, error } = await supabase
          .from('user_profiles')
          .upsert(updatedProfile)
          .select()
          .single();

        if (data && !error) {
          setProfile(data);
          // Cache locally
          await AsyncStorage.setItem('userProfile', JSON.stringify(data));
          return { success: true, data };
        } else if (error) {
          console.error('Supabase error:', error);
          // Fall back to local storage
          await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
          setProfile(updatedProfile);
          return { success: true, data: updatedProfile };
        }
      } else {
        // Supabase not configured, save to local storage only
        await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        setProfile(updatedProfile);
        return { success: true, data: updatedProfile };
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      return { success: false, error: 'Failed to save profile' };
    }

    return { success: false, error: 'Unknown error' };
  };

  // Update specific field
  const updateProfileField = async (field: keyof UserProfile, value: any) => {
    return await saveProfile({ [field]: value });
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  return {
    profile,
    loading,
    saveProfile,
    updateProfileField,
    reloadProfile: loadProfile,
  };
};