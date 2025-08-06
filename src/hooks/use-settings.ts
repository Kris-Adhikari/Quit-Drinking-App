import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserSettings {
  // Notifications
  pushNotifications: boolean;
  dailyReminders: boolean;
  achievementNotifications: boolean;
  progressReports: boolean;
  communityUpdates: boolean;
  
  // Privacy & Data
  dataCollection: boolean;
  crashReporting: boolean;
  
  // App
  darkMode: boolean;
  
  // Recovery-specific settings
  dailyGoal: number; // drinks per day
  weeklyGoal: number; // drinks per week
  trackingUnit: 'standard' | 'units' | 'ml'; // How to measure drinks
  reminderTime: string; // Time for daily reminders (HH:MM format)
  weekStart: 'monday' | 'sunday'; // Week start day for progress calculations
  showMoneySpent: boolean; // Show money saved calculations
  pricePerDrink: number; // Average price per drink for money calculations
  
  // Profile
  displayName: string;
  isAnonymous: boolean; // For community posts
  
  // Onboarding completion flags
  hasCompletedOnboarding: boolean;
  hasSeenTutorial: boolean;
}

const defaultSettings: UserSettings = {
  // Notifications
  pushNotifications: true,
  dailyReminders: true,
  achievementNotifications: true,
  progressReports: true,
  communityUpdates: false,
  
  // Privacy & Data
  dataCollection: true,
  crashReporting: true,
  
  // App
  darkMode: false,
  
  // Recovery-specific
  dailyGoal: 0, // No drinking goal
  weeklyGoal: 0, // No drinking goal
  trackingUnit: 'standard',
  reminderTime: '20:00', // 8 PM default
  weekStart: 'monday',
  showMoneySpent: true,
  pricePerDrink: 8.50, // Average drink price
  
  // Profile
  displayName: '',
  isAnonymous: true,
  
  // Onboarding
  hasCompletedOnboarding: false,
  hasSeenTutorial: false,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load settings from storage
  const loadSettings = async () => {
    try {
      setLoading(true);
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings to storage
  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('userSettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  // Update a specific setting
  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    await saveSettings({ [key]: value });
  };

  // Reset settings to default
  const resetSettings = async () => {
    try {
      setSettings(defaultSettings);
      await AsyncStorage.setItem('userSettings', JSON.stringify(defaultSettings));
    } catch (error) {
      console.log('Error resetting settings:', error);
    }
  };

  // Get a specific setting
  const getSetting = <K extends keyof UserSettings>(key: K): UserSettings[K] => {
    return settings[key];
  };

  // Export settings data
  const exportSettings = () => {
    return {
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
  };

  // Import settings data
  const importSettings = async (importedData: any) => {
    try {
      if (importedData.settings) {
        await saveSettings(importedData.settings);
      }
    } catch (error) {
      console.log('Error importing settings:', error);
    }
  };

  // Recovery-specific helpers
  const getFormattedReminderTime = () => {
    const time = settings.reminderTime.split(':');
    const hours = parseInt(time[0]);
    const minutes = time[1];
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes} ${period}`;
  };

  const getDrinkUnitLabel = () => {
    switch (settings.trackingUnit) {
      case 'standard':
        return 'drinks';
      case 'units':
        return 'units';
      case 'ml':
        return 'ml';
      default:
        return 'drinks';
    }
  };

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    updateSetting,
    saveSettings,
    resetSettings,
    getSetting,
    exportSettings,
    importSettings,
    getFormattedReminderTime,
    getDrinkUnitLabel,
  };
};