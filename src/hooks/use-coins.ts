import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCoins = () => {
  const [coins, setCoins] = useState(0);
  const [ownedBadges, setOwnedBadges] = useState<string[]>([]);

  // Load coins from AsyncStorage
  const loadCoins = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('userCoins');
      if (saved) {
        setCoins(parseInt(saved, 10));
      }
    } catch (error) {
      console.log('Error loading coins:', error);
    }
  }, []);

  // Load owned badges from AsyncStorage
  const loadOwnedBadges = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('ownedBadges');
      if (saved) {
        setOwnedBadges(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading owned badges:', error);
    }
  }, []);

  // Save coins to AsyncStorage
  const saveCoins = useCallback(async (newCoins: number) => {
    try {
      await AsyncStorage.setItem('userCoins', newCoins.toString());
      setCoins(newCoins);
    } catch (error) {
      console.log('Error saving coins:', error);
    }
  }, []);

  // Add coins
  const addCoins = useCallback(async (amount: number) => {
    const newTotal = coins + amount;
    await saveCoins(newTotal);
    return newTotal;
  }, [coins, saveCoins]);

  // Spend coins
  const spendCoins = useCallback(async (amount: number) => {
    if (coins >= amount) {
      const newTotal = coins - amount;
      await saveCoins(newTotal);
      return true;
    }
    return false; // Not enough coins
  }, [coins, saveCoins]);

  // Purchase badge
  const purchaseBadge = useCallback(async (badgeId: string) => {
    try {
      const newBadges = [...ownedBadges, badgeId];
      await AsyncStorage.setItem('ownedBadges', JSON.stringify(newBadges));
      setOwnedBadges(newBadges);
      return true;
    } catch (error) {
      console.log('Error purchasing badge:', error);
      return false;
    }
  }, [ownedBadges]);

  // Load coins and badges on mount
  useEffect(() => {
    loadCoins();
    loadOwnedBadges();
  }, [loadCoins, loadOwnedBadges]);

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