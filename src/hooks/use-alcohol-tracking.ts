import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AlcoholLog, DailyTracking, StreakData, UserStats } from '@/types/alcohol-log';
import { useAuth } from './use-auth';

export const useAlcoholTracking = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [todayLogs, setTodayLogs] = useState<AlcoholLog[]>([]);
  
  // Mock data for development when Supabase is not configured
  const mockStreakData: StreakData = {
    current_streak: 3,
    longest_streak: 7,
    last_drink_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  };
  
  const mockStats: UserStats = {
    total_days_tracked: 10,
    alcohol_free_days: 7,
    average_drinks_per_week: 4.2,
    money_saved: 150,
    calories_saved: 2100,
  };
  
  const [streakData, setStreakData] = useState<StreakData>(mockStreakData);
  const [stats, setStats] = useState<UserStats>(mockStats);

  // Check if we're using mock data
  const isUsingMockData = () => {
    return true; // Always use mock data in development
  };

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

  // Load today's logs
  const loadTodayLogs = useCallback(async () => {
    if (!user?.id || isUsingMockData()) return;

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
  }, [user]);

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
  const addAlcoholLog = async (amount: number, drinkType: string) => {
    if (!user?.id) return;

    if (isUsingMockData()) {
      // For mock mode, just update the UI
      const mockLog: AlcoholLog = {
        id: `mock-${Date.now()}`,
        user_id: user.id,
        amount,
        drink_type: drinkType,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      
      setTodayLogs([mockLog, ...todayLogs]);
      
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
    setStreakData(prev => ({
      ...prev,
      current_streak: prev.current_streak + 1,
      longest_streak: Math.max(prev.longest_streak, prev.current_streak + 1),
    }));
  };

  // Load all data on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      loadTodayLogs();
      calculateStreak();
      calculateStats();
    }
  }, [user, loadTodayLogs, calculateStreak, calculateStats]);

  return {
    loading,
    todayLogs,
    streakData,
    stats,
    addAlcoholLog,
    resetStreak,
    incrementStreak,
    refreshData: async () => {
      await Promise.all([
        loadTodayLogs(),
        calculateStreak(),
        calculateStats(),
      ]);
    },
  };
};