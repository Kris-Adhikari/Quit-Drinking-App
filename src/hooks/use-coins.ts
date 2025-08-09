import { useState, useEffect, useCallback } from 'react';
import { useUserProfile } from './use-user-profile';
import { useAuth } from './use-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCoins = () => {
  const { profile, updateCoins, saveProfile } = useUserProfile();
  const { user } = useAuth();
  const [ownedBadges, setOwnedBadges] = useState<string[]>([]);
  
  // Get coins from profile
  const coins = profile?.coins || 0;

  // Load coins (no-op since it comes from profile)
  const loadCoins = useCallback(async () => {
    // Coins are automatically loaded from profile
  }, []);

  // Load owned badges from profile or AsyncStorage fallback
  const loadOwnedBadges = useCallback(async () => {
    if (profile?.badges) {
      // Get badges from profile if available
      setOwnedBadges(profile.badges);
    } else if (!user?.id) {
      // Anonymous users use AsyncStorage
      try {
        const cached = await AsyncStorage.getItem('owned_badges');
        if (cached) {
          setOwnedBadges(JSON.parse(cached));
        }
      } catch (error) {
        console.log('Error loading badges from cache:', error);
      }
    } else {
      // Profile exists but no badges field yet, set empty array
      setOwnedBadges([]);
    }
  }, [profile?.badges, user?.id]);

  // Update badges when profile changes
  useEffect(() => {
    loadOwnedBadges();
  }, [loadOwnedBadges]);

  // Save coins to profile
  const saveCoins = useCallback(async (newCoins: number) => {
    try {
      const difference = newCoins - (coins || 0);
      await updateCoins(difference);
    } catch (error) {
      console.log('Error saving coins:', error);
    }
  }, [coins, updateCoins]);

  // Add coins
  const addCoins = useCallback(async (amount: number) => {
    const result = await updateCoins(amount);
    if (result.success) {
      return (coins || 0) + amount;
    }
    return coins || 0;
  }, [coins, updateCoins]);

  // Spend coins
  const spendCoins = useCallback(async (amount: number) => {
    if ((coins || 0) >= amount) {
      const result = await updateCoins(-amount);
      return result.success;
    }
    return false; // Not enough coins
  }, [coins, updateCoins]);

  // Purchase badge and store in profile
  const purchaseBadge = useCallback(async (badgeId: string) => {
    if (!user?.id) {
      // For anonymous users, use AsyncStorage
      try {
        const newBadges = [...ownedBadges, badgeId];
        setOwnedBadges(newBadges);
        await AsyncStorage.setItem('owned_badges', JSON.stringify(newBadges));
        return true;
      } catch (error) {
        console.log('Error purchasing badge (anonymous):', error);
        return false;
      }
    }

    try {
      // Add badge to profile
      const newBadges = [...(profile?.badges || []), badgeId];
      const result = await saveProfile({ badges: newBadges });
      
      if (result.success) {
        setOwnedBadges(newBadges);
        return true;
      } else {
        console.log('Error saving badge to profile:', result.error);
        return false;
      }
    } catch (error) {
      console.log('Error purchasing badge:', error);
      return false;
    }
  }, [ownedBadges, user?.id, profile?.badges, saveProfile]);


  return {
    coins,
    addCoins,
    spendCoins,
    setCoins: saveCoins,
    loadCoins,
    ownedBadges,
    purchaseBadge,
    loadOwnedBadges,
  };
};