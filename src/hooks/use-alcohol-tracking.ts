import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AlcoholLog, DailyTracking, StreakData, UserStats } from '@/types/alcohol-log';
import { useAuth } from './use-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAlcoholTracking = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [todayLogs, setTodayLogs] = useState<AlcoholLog[]>([]);
  
  // Default data for new users
  const defaultStreakData: StreakData = {
    current_streak: 0,
    longest_streak: 0,
    last_drink_date: null,
    start_date: new Date().toISOString(),
  };
  
  const defaultStats: UserStats = {
    total_days_tracked: 1,
    alcohol_free_days: 1,
    average_drinks_per_week: 0,
    money_saved: 0,
    calories_saved: 0,
  };
  
  const [streakData, setStreakData] = useState<StreakData>(defaultStreakData);
  const [stats, setStats] = useState<UserStats>(defaultStats);

  // Check if we're using mock data
  const isUsingMockData = () => {
    return true; // Always use mock data in development
  };

  // Load streak data from AsyncStorage
  const loadStreakData = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('streakData');
      const lastStreakUpdate = await AsyncStorage.getItem('lastStreakUpdate');
      
      if (saved && lastStreakUpdate) {
        const lastUpdate = new Date(lastStreakUpdate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        lastUpdate.setHours(0, 0, 0, 0);
        
        // Only use saved streak if it was updated today or yesterday
        const daysDiff = Math.floor((today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 1) {
          setStreakData(JSON.parse(saved));
        } else {
          // Reset streak if it's been more than 1 day
          console.log('Resetting streak - last update was more than 1 day ago');
          await AsyncStorage.removeItem('streakData');
          await AsyncStorage.removeItem('lastStreakUpdate');
          setStreakData(defaultStreakData);
        }
      }
    } catch (error) {
      console.log('Error loading streak data:', error);
    }
  }, []);

  // Save streak data to AsyncStorage
  const saveStreakData = useCallback(async (data: StreakData) => {
    try {
      await AsyncStorage.setItem('streakData', JSON.stringify(data));
      await AsyncStorage.setItem('lastStreakUpdate', new Date().toISOString());
      setStreakData(data);
    } catch (error) {
      console.log('Error saving streak data:', error);
    }
  }, []);

  // Calculate streak from logs
  const calculateStreak = useCallback(async () => {
    if (!user?.id || isUsingMockData()) return;

    try {
      const { data: logs, error } = await supabase
        .from('alcohol_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Group logs by date
      const logsByDate = new Map<string, AlcoholLog[]>();
      logs?.forEach(log => {
        const date = new Date(log.timestamp).toDateString();
        if (!logsByDate.has(date)) {
          logsByDate.set(date, []);
        }
        logsByDate.get(date)?.push(log);
      });

      // Calculate current streak
      let currentStreak = 0;
      let checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);
      
      // Start from yesterday to avoid counting today until it's complete
      checkDate.setDate(checkDate.getDate() - 1);

      while (true) {
        const dateStr = checkDate.toDateString();
        const dayLogs = logsByDate.get(dateStr) || [];
        
        if (dayLogs.length === 0) {
          currentStreak++;
        } else {
          break;
        }

        checkDate.setDate(checkDate.getDate() - 1);
        
        // Don't count days before user started tracking
        if (checkDate < new Date(user.created_at)) {
          break;
        }
      }

      // Calculate longest streak
      let longestStreak = currentStreak;
      let tempStreak = 0;
      const sortedDates = Array.from(logsByDate.keys()).sort();

      for (let i = 0; i < sortedDates.length + 1; i++) {
        const currentDate = sortedDates[i];
        const prevDate = sortedDates[i - 1];

        if (prevDate && currentDate) {
          const current = new Date(currentDate);
          const prev = new Date(prevDate);
          const daysDiff = Math.floor((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff > 1) {
            tempStreak = daysDiff - 1;
            longestStreak = Math.max(longestStreak, tempStreak);
          }
        }
      }

      const lastDrinkDate = logs && logs.length > 0 ? logs[0].timestamp : null;

      setStreakData({
        current_streak: currentStreak,
        longest_streak: longestStreak,
        last_drink_date: lastDrinkDate,
        start_date: user.created_at,
      });
    } catch (error: any) {
      // Network error - keep using mock data
      if (error?.message?.includes('Network request failed')) {
        console.log('Using mock data - Supabase not configured');
      } else {
        console.error('Error calculating streak:', error);
      }
    }
  }, [user]);

  // Load mock logs from AsyncStorage
  const loadMockLogs = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('mockTodayLogs');
      if (saved) {
        const logs = JSON.parse(saved);
        // Filter for today's logs only
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayLogs = logs.filter((log: AlcoholLog) => {
          const logDate = new Date(log.timestamp);
          logDate.setHours(0, 0, 0, 0);
          return logDate.getTime() === today.getTime();
        });
        setTodayLogs(todayLogs);
      } else {
        setTodayLogs([]);
      }
    } catch (error) {
      console.log('Error loading mock logs:', error);
    }
  }, []);

  // Save mock logs to AsyncStorage
  const saveMockLogs = async (logs: AlcoholLog[]) => {
    try {
      await AsyncStorage.setItem('mockTodayLogs', JSON.stringify(logs));
    } catch (error) {
      console.log('Error saving mock logs:', error);
    }
  };

  // Load today's logs
  const loadTodayLogs = useCallback(async () => {
    if (!user?.id) return;
    
    if (isUsingMockData()) {
      await loadMockLogs();
      return;
    }

    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('alcohol_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', today.toISOString())
        .lt('timestamp', tomorrow.toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;

      setTodayLogs(data || []);
    } catch (error: any) {
      // Network error - keep using empty logs
      if (error?.message?.includes('Network request failed')) {
        console.log('Using mock data - Supabase not configured');
      } else {
        console.error('Error loading today logs:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [user, loadMockLogs]);

  // Calculate user stats
  const calculateStats = useCallback(async () => {
    if (!user?.id || isUsingMockData()) return;

    try {
      const { data: logs, error } = await supabase
        .from('alcohol_logs')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculate stats
      const startDate = new Date(user.created_at);
      const today = new Date();
      const totalDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      // Group by date to find alcohol-free days
      const drinksPerDate = new Map<string, number>();
      logs?.forEach(log => {
        const date = new Date(log.timestamp).toDateString();
        drinksPerDate.set(date, (drinksPerDate.get(date) || 0) + log.amount);
      });

      const alcoholFreeDays = totalDays - drinksPerDate.size;

      // Calculate weekly average
      const weeks = Math.ceil(totalDays / 7);
      const totalDrinks = logs?.reduce((sum, log) => sum + log.amount, 0) || 0;
      const avgDrinksPerWeek = totalDrinks / weeks;

      // Estimate money and calories saved
      const avgCostPerDrink = 8; // $8 average
      const avgCaloriesPerDrink = 140;
      const expectedDrinksWithoutApp = avgDrinksPerWeek * weeks * 1.5; // Assume 50% more without app
      const drinksSaved = Math.max(0, expectedDrinksWithoutApp - totalDrinks);
      
      setStats({
        total_days_tracked: totalDays,
        alcohol_free_days: alcoholFreeDays,
        average_drinks_per_week: Math.round(avgDrinksPerWeek * 10) / 10,
        money_saved: Math.round(drinksSaved * avgCostPerDrink),
        calories_saved: Math.round(drinksSaved * avgCaloriesPerDrink),
      });
    } catch (error: any) {
      // Network error - keep using mock data
      if (error?.message?.includes('Network request failed')) {
        console.log('Using mock data - Supabase not configured');
      } else {
        console.error('Error calculating stats:', error);
      }
    }
  }, [user]);

  // Add new alcohol log
  const addAlcoholLog = async (
    amount: number, 
    drinkType: string, 
    price?: number, 
    calories?: number, 
    alcoholContent?: number, 
    volume?: number, 
    notes?: string
  ) => {
    if (!user?.id) return;

    if (isUsingMockData()) {
      // For mock mode, just update the UI
      const mockLog: AlcoholLog = {
        id: `mock-${Date.now()}`,
        user_id: user.id,
        amount,
        drink_type: drinkType,
        price,
        calories,
        alcohol_content: alcoholContent,
        volume,
        notes,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      
      const newLogs = [mockLog, ...todayLogs];
      setTodayLogs(newLogs);
      await saveMockLogs(newLogs); // Persist the mock logs
      
      // Reset streak if adding a drink
      setStreakData({
        ...streakData,
        current_streak: 0,
        last_drink_date: new Date().toISOString(),
      });
      
      return mockLog;
    }

    try {
      const { data, error } = await supabase
        .from('alcohol_logs')
        .insert({
          user_id: user.id,
          amount,
          drink_type: drinkType,
          price,
          calories,
          alcohol_content: alcoholContent,
          volume,
          notes,
          timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh data
      await Promise.all([
        loadTodayLogs(),
        calculateStreak(),
        calculateStats(),
      ]);

      return data;
    } catch (error) {
      console.error('Error adding alcohol log:', error);
      throw error;
    }
  };

  // Reset streak (when user drinks)
  const resetStreak = async () => {
    // Add a log entry with 0 drinks to mark the reset
    await addAlcoholLog(1, 'Reset');
  };

  // Increment streak (when all daily tasks are completed)
  const incrementStreak = async () => {
    const newStreakData = {
      ...streakData,
      current_streak: streakData.current_streak + 1,
      longest_streak: Math.max(streakData.longest_streak, streakData.current_streak + 1),
    };
    await saveStreakData(newStreakData);
  };

  // Load all data on mount and when user changes
  useEffect(() => {
    loadStreakData(); // Always load streak data (even without user)
    
    if (user?.id) {
      loadTodayLogs(); // This will now load mock logs if in mock mode
      calculateStreak();
      calculateStats();
    }
  }, [user, loadTodayLogs, calculateStreak, calculateStats, loadStreakData]);

  // Calculate today's total drinks
  const todayTotal = todayLogs.reduce((sum, log) => sum + log.amount, 0);

  // Memoize refreshData to prevent infinite re-renders
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadTodayLogs(),
      calculateStreak(),
      calculateStats(),
    ]);
  }, [loadTodayLogs, calculateStreak, calculateStats]);

  return {
    loading,
    todayLogs,
    todayTotal,
    streakData,
    stats,
    addAlcoholLog,
    resetStreak,
    incrementStreak,
    refreshData,
  };
};