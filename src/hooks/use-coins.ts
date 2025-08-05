import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCoins = () => {
  const [coins, setCoins] = useState(0);

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
      return newTotal;
    }
    return coins; // Not enough coins
  }, [coins, saveCoins]);

  // Load coins on mount
  useEffect(() => {
    loadCoins();
  }, [loadCoins]);

  return {
    coins,
    addCoins,
    spendCoins,
    setCoins: saveCoins,
    loadCoins,
  };
};