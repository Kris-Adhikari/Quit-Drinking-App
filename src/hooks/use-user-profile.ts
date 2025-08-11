import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  coins: number;
  current_streak: number;
  longest_streak: number;
  last_check_in?: string;
  age?: number;
  gender?: string;
  location?: string;
  relationship_status?: string;
  onboarding_completed?: boolean;
  badges?: string[];
  created_at?: string;
  updated_at?: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const lastLoadTimeRef = useRef<number>(0);
  const MIN_RELOAD_INTERVAL = 2000; // Minimum 2 seconds between reloads

  // Load profile - AsyncStorage only for anonymous, Supabase for authenticated
  const loadProfile = useCallback(async (forceRefresh = false) => {
    // Throttle reloads to prevent excessive database requests
    const now = Date.now();
    if (!forceRefresh && now - lastLoadTimeRef.current < MIN_RELOAD_INTERVAL) {
      return; // Skip if called too frequently
    }
    lastLoadTimeRef.current = now;
    
    try {
      
      // Check if user is anonymous (not signed in)
      if (!user || !user.email) {
        setIsAnonymous(true);
        // For anonymous users, only use AsyncStorage
        const localProfile = await AsyncStorage.getItem('anonymous_profile');
        if (localProfile) {
          setProfile(JSON.parse(localProfile));
        } else {
          // Create default anonymous profile
          const defaultProfile: UserProfile = {
            id: 'anonymous',
            user_id: 'anonymous',
            name: '',
            coins: 0,
            current_streak: 0,
            longest_streak: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setProfile(defaultProfile);
        }
      } else {
        // Authenticated user - use Supabase
        setIsAnonymous(false);
        
        // Always fetch fresh data from Supabase to ensure sync
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data && !error) {
          // For existing profiles without onboarding_completed set, default it to true
          // This handles existing users who shouldn't see onboarding again
          if (data.onboarding_completed === null || data.onboarding_completed === undefined) {
            const updatedData = { ...data, onboarding_completed: true };
            const { data: updateResult } = await supabase
              .from('user_profiles')
              .update({ onboarding_completed: true })
              .eq('user_id', user.id)
              .select()
              .single();
            
            if (updateResult) {
              setProfile(updateResult);
              await AsyncStorage.setItem(`profile_${user.id}`, JSON.stringify(updateResult));
            } else {
              setProfile(updatedData);
              await AsyncStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedData));
            }
          } else {
            setProfile(data);
            // Update cache with fresh data
            await AsyncStorage.setItem(`profile_${user.id}`, JSON.stringify(data));
          }
          
          // Clear any stale cache that might be conflicting
          await AsyncStorage.removeItem('anonymous_profile');
          
          // Check for anonymous data to migrate only if profile has no name
          if (!data.name) {
            const anonymousProfile = await AsyncStorage.getItem('anonymous_profile');
            if (anonymousProfile) {
              const anonData = JSON.parse(anonymousProfile);
              if (anonData.name) {
                // Update profile with anonymous data
                const { data: updated } = await supabase
                  .from('user_profiles')
                  .update({ 
                    name: anonData.name,
                    age: anonData.age,
                    gender: anonData.gender,
                    location: anonData.location,
                    relationship_status: anonData.relationship_status,
                  })
                  .eq('user_id', user.id)
                  .select()
                  .single();
                if (updated) {
                  setProfile(updated);
                  await AsyncStorage.setItem(`profile_${user.id}`, JSON.stringify(updated));
                }
              }
              // Clear anonymous profile after migration
              await AsyncStorage.removeItem('anonymous_profile');
            }
          }
        } else if (error?.code === 'PGRST116') {
          // No profile found, create one and migrate anonymous data if exists
          const anonymousProfile = await AsyncStorage.getItem('anonymous_profile');
          const anonymousData = anonymousProfile ? JSON.parse(anonymousProfile) : {};
          
          const newProfile = {
            user_id: user.id,
            name: anonymousData.name || '',
            coins: anonymousData.coins || 0,
            current_streak: anonymousData.current_streak || 0,
            longest_streak: anonymousData.longest_streak || 0,
            age: anonymousData.age,
            gender: anonymousData.gender,
            location: anonymousData.location,
            relationship_status: anonymousData.relationship_status,
          };
          
          const { data: createdProfile } = await supabase
            .from('user_profiles')
            .insert(newProfile)
            .select()
            .single();
            
          if (createdProfile) {
            setProfile(createdProfile);
            // Cache the new profile
            await AsyncStorage.setItem(`profile_${user.id}`, JSON.stringify(createdProfile));
            // Clear anonymous profile after migration
            await AsyncStorage.removeItem('anonymous_profile');
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);


  // Save or update profile
  const saveProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    try {
      // For anonymous users, only save to AsyncStorage
      if (isAnonymous || !user || !user.email) {
        const updatedProfile = {
          ...profile,
          ...profileData,
          id: 'anonymous',
          user_id: 'anonymous',
          updated_at: new Date().toISOString(),
        } as UserProfile;
        
        setProfile(updatedProfile);
        await AsyncStorage.setItem('anonymous_profile', JSON.stringify(updatedProfile));
        return { success: true, data: updatedProfile };
      }

      // For authenticated users, save to Supabase
      const updatedProfile = {
        ...profile,
        ...profileData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      } as UserProfile;

      // Optimistically update local state and cache
      setProfile(updatedProfile);
      await AsyncStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));

      // Then save to Supabase - upsert with conflict resolution on user_id
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(updatedProfile, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (data && !error) {
        // Update with server response (may have server-set fields)
        setProfile(data);
        
        // Update cache with server response
        await AsyncStorage.setItem(`profile_${user.id}`, JSON.stringify(data));
        
        return { success: true, data };
      } else if (error) {
        console.error('Supabase save error:', error);
        // Revert optimistic update on error
        if (profile) {
          setProfile(profile);
          await AsyncStorage.setItem(`profile_${user.id}`, JSON.stringify(profile));
        }
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      return { success: false, error: 'Failed to save profile' };
    }

    return { success: false, error: 'Unknown error' };
  }, [profile, isAnonymous, user]);

  // Update specific field
  const updateProfileField = useCallback(async (field: keyof UserProfile, value: any) => {
    return await saveProfile({ [field]: value });
  }, [saveProfile]);

  useEffect(() => {
    loadProfile();
  }, [user?.id]); // Only depend on user.id, not the entire loadProfile function

  // Update streak data
  const updateStreak = useCallback(async (newStreak: number) => {
    if (!profile) {
      return { success: false, error: 'No profile loaded' };
    }
    
    const updates: Partial<UserProfile> = {
      current_streak: newStreak,
      last_check_in: new Date().toISOString(),
    };
    
    // Update longest streak if current is higher
    if (newStreak > (profile.longest_streak || 0)) {
      updates.longest_streak = newStreak;
    }
    
    const result = await saveProfile(updates);
    return result;
  }, [profile, saveProfile]);

  // Update coins
  const updateCoins = useCallback(async (amount: number) => {
    if (!profile) return { success: false, error: 'No profile loaded' };
    
    const newCoins = Math.max(0, (profile.coins || 0) + amount);
    return await saveProfile({ coins: newCoins });
  }, [profile, saveProfile]);

  // Mark onboarding as completed
  const completeOnboarding = useCallback(async () => {
    return await saveProfile({ onboarding_completed: true });
  }, [saveProfile]);

  // Delete user account and all data
  const deleteAccount = useCallback(async () => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      if (isAnonymous) {
        // For anonymous users, just clear local data
        await AsyncStorage.clear();
        setProfile(null);
        return { success: true };
      }

      // For authenticated users, delete from Supabase
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }

      // Delete alcohol logs
      const { error: logsError } = await supabase
        .from('alcohol_logs')
        .delete()
        .eq('user_id', user.id);

      if (logsError) {
        console.error('Error deleting logs:', logsError);
      }

      // Clear local data
      await AsyncStorage.clear();
      setProfile(null);

      // Note: User account deletion from auth.users requires admin privileges
      // In production, you'd call a cloud function to handle this
      console.log('Account data deleted. Note: Auth user still exists and requires admin deletion.');

      return { success: true };
    } catch (error) {
      console.error('Error deleting account:', error);
      return { success: false, error: 'Failed to delete account' };
    }
  }, [user, isAnonymous]);

  return {
    profile,
    loading,
    isAnonymous,
    saveProfile,
    updateProfileField,
    updateStreak,
    updateCoins,
    completeOnboarding,
    deleteAccount,
    reloadProfile: () => loadProfile(true), // Force refresh when explicitly reloading
  };
};