import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAlcoholTracking } from '@/hooks/use-alcohol-tracking';
import { useAuth } from '@/hooks/use-auth';
import { useCoins } from '@/hooks/use-coins';
import { useUserProfile } from '@/hooks/use-user-profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getArticleForDay } from '@/data/alcohol-articles';
import { weightLossTips, afDayBenefits, CALORIES_PER_DRINK } from '@/lib/weight-loss-content';
import { getDailyWorkout, getBurnADrinkTime } from '@/lib/workout-content';

const { width } = Dimensions.get('window');

interface Task {
  id: string;
  title: string;
  duration: string;
  icon: string;
  completed: boolean;
  route?: string;
}

interface DayData {
  date: Date;
  tasks: Task[];
}

export default function Daily() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile, reloadProfile, updateStreak, saveProfile } = useUserProfile();
  const { todayTotal, todayLogs, refreshData } = useAlcoholTracking();
  const { coins, addCoins, loadCoins } = useCoins();
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(0); // 0 is today (offset from todayIndex)
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Store task completion states
  const [taskStates, setTaskStates] = useState<{[key: string]: boolean}>({});
  const [dayCompleted, setDayCompleted] = useState<{[key: string]: boolean}>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [newStreakCount, setNewStreakCount] = useState(0);
  const [todayDrinkStatus, setTodayDrinkStatus] = useState<'logged' | 'sober' | null>(null);
  const [storedDrinkCount, setStoredDrinkCount] = useState<number>(0);
  const [todayCalories, setTodayCalories] = useState<number>(0);
  const [totalCaloriesSaved, setTotalCaloriesSaved] = useState<number>(0);
  const [jarResetMessage, setJarResetMessage] = useState<string>('');
  const [rewardedPounds, setRewardedPounds] = useState<number>(0);
  const [workoutCompleted, setWorkoutCompleted] = useState<boolean>(false);

  const CARD_WIDTH = 82; // Card width + gap

  // Today is always index 0 (since we start from today)
  const todayIndex = 0;

  // Use the same logic as the calendar to get accurate drink data
  const getActualDrinkData = () => {
    // Always prioritize showing drinks if there are any
    if (todayTotal > 0) {
      return { 
        isSober: false,
        drinkCount: Math.round(todayTotal),
        hasData: true,
        calories: todayCalories // Use accurate calories
      };
    }
    
    // Check if task is completed and what type
    const taskCompleted = taskStates[`task_drinks_0`] || false;
    if (taskCompleted) {
      // Use the drink status to determine what to show
      if (todayDrinkStatus === 'logged') {
        // Drinks were logged - show the stored count
        const displayCount = Math.max(todayTotal, storedDrinkCount);
        return { 
          isSober: false,
          drinkCount: Math.round(displayCount),
          hasData: true,
          calories: todayCalories // Use accurate calories from storage
        };
      } else if (todayDrinkStatus === 'sober') {
        // "No Drinks Today" was pressed
        return { 
          isSober: true,
          drinkCount: 0,
          hasData: true,
          calories: 0
        };
      }
    }
    
    // No data for today yet
    return { isSober: false, drinkCount: 0, hasData: false, calories: 0 };
  };

  const actualDrinkData = getActualDrinkData();
  const caloriesFromDrinks = actualDrinkData.calories || Math.round(actualDrinkData.drinkCount * CALORIES_PER_DRINK);
  
  // Get today's workout
  const todayWorkout = getDailyWorkout();
  const burnADrinkTime = getBurnADrinkTime(todayWorkout.calories);

  // Weight loss progress calculations
  const CALORIES_PER_POUND = 3500; // Standard calories in 1 lb of fat
  const currentCaloriesForJar = totalCaloriesSaved % CALORIES_PER_POUND; // Reset every pound
  const progressPercent = Math.min(100, (currentCaloriesForJar / CALORIES_PER_POUND) * 100);
  const totalDots = 20; // 20 dots for visual progress
  const filledDots = Math.floor((progressPercent / 100) * totalDots);
  const poundsLost = Math.floor(totalCaloriesSaved / CALORIES_PER_POUND);
  
  // Add calories saved today if it's an AF day
  const caloriesSavedToday = actualDrinkData.isSober ? 280 : 0; // Assume 2 drinks worth (2 * 140)

  // Get random daily tip and benefit highlight based on current date
  const getDailyTip = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return weightLossTips[dayOfYear % weightLossTips.length];
  };

  const getAFBenefit = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return afDayBenefits[dayOfYear % afDayBenefits.length];
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Function to check and award jar completion
  const checkJarCompletion = useCallback(async (newTotalCalories: number) => {
    const currentPounds = Math.floor(newTotalCalories / CALORIES_PER_POUND);
    
    // Only award if we have a new pound that hasn't been rewarded yet
    if (currentPounds > rewardedPounds && currentPounds > 0) {
      // Immediately update to prevent duplicates
      setRewardedPounds(currentPounds);
      await AsyncStorage.setItem('rewardedPounds', currentPounds.toString());
      
      // Award coins using the same pattern as daily streaks - atomic update
      try {
        const currentCoins = profile?.coins || 0;
        const newCoinsValue = currentCoins + 50;
        
        // Atomic update to Supabase
        const result = await saveProfile({ 
          coins: newCoinsValue
        });
        
        if (result.success) {
          await reloadProfile(); // Reload to show updated coins
          console.log('Added 50 coins for completing weight loss jar - pound', currentPounds);
          
          setJarResetMessage(`milestone-${currentPounds}`); // Use identifier instead of full message
        } else {
          console.log('Error saving coins to profile:', result.error);
        }
      } catch (error) {
        console.log('Error adding coins for jar completion:', error);
      }
    }
  }, [rewardedPounds, profile?.coins, saveProfile, reloadProfile]);

  // Scroll to today on mount
  useEffect(() => {
    setTimeout(() => {
      // Scroll to show today as the first visible day
      scrollViewRef.current?.scrollTo({ x: todayIndex * CARD_WIDTH, animated: false });
    }, 100);
  }, [todayIndex]);

  // Load task completion states from AsyncStorage
  const loadTaskStates = useCallback(async () => {
    try {
      const completedTasks = await AsyncStorage.getItem('completedTasks');
      if (completedTasks) {
        setTaskStates(JSON.parse(completedTasks));
      }
      
      const completedDays = await AsyncStorage.getItem('completedDays');
      if (completedDays) {
        setDayCompleted(JSON.parse(completedDays));
      }
    } catch (error) {
      console.log('Error loading task states:', error);
    }
  }, []);

  // Reload task states and coins when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        // Load task states first
        await loadTaskStates();
        
        // Then load other data if we have the required functions
        if (typeof loadCoins === 'function') await loadCoins();
        if (typeof reloadProfile === 'function') await reloadProfile();
        if (typeof refreshData === 'function') await refreshData();
        
        // Check today's drink status and count
        try {
          const statusData = await AsyncStorage.getItem('todayDrinkStatus');
          const countDate = await AsyncStorage.getItem('todayDrinkCountDate');
          const today = new Date().toDateString();
          
          if (statusData) {
            const { date, status } = JSON.parse(statusData);
            if (date === today) {
              // If drinks are logged, clear the sober status
              if (todayTotal > 0 && status === 'sober') {
                setTodayDrinkStatus('logged');
              } else {
                setTodayDrinkStatus(status);
              }
            }
          } else if (todayTotal > 0) {
            // If no status but drinks are logged, set as logged
            setTodayDrinkStatus('logged');
          }
          
          if (countDate === today) {
            const count = await AsyncStorage.getItem('todayDrinkCount');
            setStoredDrinkCount(count ? parseFloat(count) : 0);
          } else {
            setStoredDrinkCount(0);
          }
          
          // Load today's calories
          const caloriesData = await AsyncStorage.getItem('todayCalories');
          if (caloriesData) {
            const { date, calories } = JSON.parse(caloriesData);
            if (date === today) {
              setTodayCalories(calories || 0);
            } else {
              setTodayCalories(0);
            }
          } else {
            setTodayCalories(0);
          }
          
          // Load total calories saved for weight progress
          const totalSavedData = await AsyncStorage.getItem('totalCaloriesSaved');
          if (totalSavedData) {
            setTotalCaloriesSaved(parseInt(totalSavedData) || 0);
          }
          
          // Load rewarded pounds to prevent duplicate coin rewards
          const rewardedData = await AsyncStorage.getItem('rewardedPounds');
          if (rewardedData) {
            setRewardedPounds(parseInt(rewardedData) || 0);
          }
          
          // Load today's workout completion
          const workoutData = await AsyncStorage.getItem('dailyWorkoutCompleted');
          if (workoutData) {
            const { date, completed } = JSON.parse(workoutData);
            if (date === today) {
              setWorkoutCompleted(completed || false);
            } else {
              setWorkoutCompleted(false);
            }
          }
          
        } catch (error) {
          console.log('Error loading drink data:', error);
        }
      };
      loadData();
    }, []) // Empty dependency array - only run on mount/focus
  );

  // Generate tasks for different days
  const getTasksForDay = (dayOffset: number): Task[] => {
    const baseTasks = [
      {
        id: `task2_${dayOffset}`,
        title: 'Daily Motivation',
        duration: '1 min read',
        icon: '💡',
        completed: false,
        route: '/daily-quote',
      },
      {
        id: `task_drinks_${dayOffset}`,
        title: 'Log Your Drinks',
        duration: '2 min',
        icon: '🍷',
        completed: false,
        route: '/drink-logger',
      },
    ];

    // Add article task for first 20 days only
    const dayIndex = Math.max(0, dayOffset); // Don't show articles for past days
    const article = getArticleForDay(dayIndex);
    
    if (article && dayOffset >= 0) {
      baseTasks.unshift({
        id: `task1_${dayOffset}`,
        title: article.title,
        duration: article.duration,
        icon: '📚',
        completed: false,
        route: `/articles/${article.id}`,
      });
    }

    // Add different tasks for different days
    if (dayOffset === -1) {
      baseTasks.push({
        id: `task3_${dayOffset}`,
        title: 'Mindful Breathing Exercise',
        duration: '5 min',
        icon: '🧘',
        completed: false,
        route: '/content/breathing',
      });
    }

    // Check if tasks are completed from state
    return baseTasks.map(task => ({
      ...task,
      completed: taskStates[task.id] || false,
    }));
  };

  // Check if all tasks for a specific day are completed
  const checkDayCompletion = useCallback(async (dayOffset: number) => {
    const todayTasks = getTasksForDay(dayOffset);
    
    // Don't trigger completion if there are no tasks
    if (todayTasks.length === 0) {
      return;
    }
    
    // Don't trigger if taskStates hasn't been loaded yet (all tasks would be undefined)
    const hasAnyTaskState = todayTasks.some(task => taskStates.hasOwnProperty(task.id));
    const allCompleted = hasAnyTaskState && todayTasks.every(task => taskStates[task.id]);
    
    if (allCompleted && dayOffset === 0) { // Only for today
      const today = new Date().toDateString();
      
      // Check if we already completed today
      if (!dayCompleted[today]) {
        // Immediately mark as completed to prevent duplicate calls
        const newDayCompleted = {
          ...dayCompleted,
          [today]: true,
        };
        
        setDayCompleted(newDayCompleted);
        
        try {
          await AsyncStorage.setItem('completedDays', JSON.stringify(newDayCompleted));
          
          // Check last check-in date to prevent incrementing streak multiple times same day
          const lastCheckIn = profile?.last_check_in;
          const lastCheckInDate = lastCheckIn ? new Date(lastCheckIn).toDateString() : null;
          const shouldIncrementStreak = lastCheckInDate !== today;
          
          // Update streak and coins atomically to prevent race condition
          const currentStreak = profile?.current_streak || 0;
          const currentCoins = profile?.coins || 0;
          const newStreakValue = shouldIncrementStreak ? currentStreak + 1 : currentStreak;
          const newCoinsValue = currentCoins + 50;
          
          // Create atomic update for both streak and coins
          const atomicUpdate = {
            current_streak: newStreakValue,
            longest_streak: Math.max(newStreakValue, profile?.longest_streak || 0),
            last_check_in: new Date().toISOString(),
            coins: newCoinsValue,
          };
          
          // Use saveProfile directly to make atomic update
          const atomicResult = await saveProfile(atomicUpdate);
          
          // No need to reload immediately as saveProfile updates local state
          // The profile will refresh on next screen focus if needed
          
          // Show celebration popup with the correct new streak
          setNewStreakCount(newStreakValue);
          setShowCelebration(true);
          
          // If it's an AF day, add calories saved for weight progress
          if (todayDrinkStatus === 'sober' || (todayTotal === 0 && taskStates[`task_drinks_0`])) {
            const caloriesSaved = 280; // Assume 2 drinks avoided (2 * 140)
            const newTotalSaved = totalCaloriesSaved + caloriesSaved;
            setTotalCaloriesSaved(newTotalSaved);
            await AsyncStorage.setItem('totalCaloriesSaved', newTotalSaved.toString());
            
            // Check for jar completion and award coins
            await checkJarCompletion(newTotalSaved);
            
            console.log('Added calories saved:', caloriesSaved, 'New total:', newTotalSaved);
          }
        } catch (error) {
          console.log('ERROR saving day completion:', error);
        }
      }
    }
  }, [taskStates, dayCompleted, saveProfile, profile, todayDrinkStatus, todayTotal, totalCaloriesSaved, checkJarCompletion]);

  // Check day completion when task states change - removed to prevent loops
  // The checkDayCompletion is called when individual tasks are completed instead

  const handleDayPress = (index: number) => {
    const dayOffset = index - todayIndex; // Calculate offset from today
    setSelectedDay(dayOffset);
    scrollViewRef.current?.scrollTo({ x: index * CARD_WIDTH, animated: true });
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get user's first name from profile or email
  const firstName = profile?.name || user?.email?.split('@')[0] || 'User';

  // Format date
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return currentTime.toLocaleDateString('en-US', options);
  };

  // Generate days array based on actual calendar days
  const generateDays = (): DayData[] => {
    const days: DayData[] = [];
    const today = new Date();
    
    // Show today and next 14 days (no past days)
    for (let i = 0; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      days.push({
        date,
        tasks: getTasksForDay(i),
      });
    }
    return days;
  };

  const days = generateDays();
  const currentDayTasks = days[todayIndex + selectedDay]?.tasks || [];
  const allTasksCompleted = currentDayTasks.every(task => task.completed);

  // Get progress for a specific day based on the day's date
  const getDayProgress = (dayDate: Date, dayOffset: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDay = new Date(dayDate);
    targetDay.setHours(0, 0, 0, 0);
    
    const isToday = targetDay.getTime() === today.getTime();
    const isPast = targetDay.getTime() < today.getTime();
    const isFuture = targetDay.getTime() > today.getTime();
    
    // Check if this day's tasks were completed
    const dayWasCompleted = dayCompleted[targetDay.toDateString()];
    
    // Since we only show today and future days, no past days will have streaks from being "past"
    const hasStreak = false;
    
    // Today shows fire if tasks are completed
    const todayCompleted = isToday && dayWasCompleted;
    
    // Get weekday abbreviation and day number
    const weekday = targetDay.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dayNumber = targetDay.getDate();

    return { hasStreak, isToday, isFuture, todayCompleted, weekday, dayNumber, dayOffset, isPast };
  };


  const handleTaskPress = (task: Task) => {
    if (task.route) {
      if (task.route === '/daily-quote' || task.route === '/neuroplasticity-article' || task.route.startsWith('/articles/')) {
        router.push({
          pathname: task.route,
          params: { taskId: task.id }
        });
      } else {
        router.push(task.route);
      }
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const newState = {
      ...taskStates,
      [taskId]: !taskStates[taskId],
    };
    setTaskStates(newState);
    
    try {
      await AsyncStorage.setItem('completedTasks', JSON.stringify(newState));
      
      // Check if all tasks are now completed for today
      setTimeout(() => checkDayCompletion(0), 100);
    } catch (error) {
      console.log('Error saving task state:', error);
    }
  };

  const toggleWorkoutCompletion = async () => {
    const newCompleted = !workoutCompleted;
    setWorkoutCompleted(newCompleted);
    
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem('dailyWorkoutCompleted', JSON.stringify({
        date: today,
        completed: newCompleted
      }));
    } catch (error) {
      console.log('Error saving workout completion:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fb" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.coinsContainer}>
          <Text style={styles.coinsText}>🏅 {profile ? (profile.coins || 0) : '...'}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date and Greeting */}
        <Text style={styles.date}>{formatDate()}</Text>
        <Text style={styles.greeting}>
          {getGreeting()},{'\n'}
          <Text style={styles.userName}>{firstName}</Text>
        </Text>

        {/* Test Buttons */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={async () => {
              const result = await saveProfile({ onboarding_completed: true });
              console.log('Onboarding completion result:', result);
              await reloadProfile();
            }}
          >
            <Text style={styles.testButtonText}>Complete Onboarding</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={async () => {
              const caloriesSaved = 280;
              const newTotalSaved = totalCaloriesSaved + caloriesSaved;
              setTotalCaloriesSaved(newTotalSaved);
              await AsyncStorage.setItem('totalCaloriesSaved', newTotalSaved.toString());
              
              // Check for jar completion and award coins
              await checkJarCompletion(newTotalSaved);
              
              console.log('Test: Added calories saved:', caloriesSaved, 'New total:', newTotalSaved);
            }}
          >
            <Text style={styles.testButtonText}>Add 280 Cal Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={async () => {
              await signOut();
              // Clear AsyncStorage to remove any cached session data
              await AsyncStorage.clear();
              router.replace('/auth/sign-in');
            }}
          >
            <Text style={styles.testButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Streak Counter */}
        <View style={styles.streakContainer}>
          <View style={styles.streakCircle}>
            <Text style={styles.streakNumber}>
              {profile ? (profile.current_streak || 0) : '...'}
            </Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Today's Drinks Summary */}
        <View style={styles.drinksSummaryCard}>
          <View style={styles.drinksSummaryContent}>
            <View style={styles.drinksSummaryIcon}>
              <Text style={styles.drinksSummaryEmoji}>🍷</Text>
            </View>
            <View style={styles.drinksSummaryText}>
              <Text style={styles.drinksSummaryTitle}>Today's Drinks</Text>
              <Text style={styles.drinksSummaryCount}>
                {actualDrinkData.drinkCount === 0 ? 
                  (actualDrinkData.isSober ? 'Alcohol-Free Day' : 'No drinks logged') : 
                 actualDrinkData.drinkCount === 1 ? '1 drink' : 
                 `${actualDrinkData.drinkCount} drinks`}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.logDrinksQuickButton}
              onPress={() => router.push('/drink-logger')}
            >
              <Text style={styles.logDrinksQuickButtonText}>Log</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calories Display - Always show */}
        <View style={[
          styles.caloriesSavedCard,
          (actualDrinkData.isSober || todayDrinkStatus === 'sober' || (todayTotal === 0 && taskStates[`task_drinks_0`])) && styles.caloriesAFCard
        ]}>
          {(actualDrinkData.isSober || todayDrinkStatus === 'sober' || (todayTotal === 0 && taskStates[`task_drinks_0`])) ? (
            <View style={styles.celebrationCardContent}>
              <View style={styles.celebrationIcon}>
                <Text style={styles.celebrationEmoji}>✨</Text>
              </View>
              <View style={styles.celebrationTextContainer}>
                <Text style={styles.celebrationCardTitle}>Alcohol-Free Day!</Text>
                <Text style={styles.celebrationCardSubtitle}>Zero calories from drinks today</Text>
              </View>
            </View>
          ) : (
            <View style={styles.caloriesCardContent}>
              <View style={styles.caloriesIcon}>
                <Text style={styles.caloriesEmoji}>🍷</Text>
              </View>
              <View style={styles.caloriesTextContainer}>
                <Text style={styles.caloriesCardTitle}>Calories from Drinks</Text>
                <Text style={styles.caloriesCardNumber}>{caloriesFromDrinks}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Weight Loss Fact - Shows on AF days */}
        {(todayDrinkStatus === 'sober' || todayTotal === 0) && (
          <View style={styles.weightLossFactCard}>
            <View style={styles.weightLossFactIcon}>
              <Text style={styles.weightLossFactEmoji}>⚖️</Text>
            </View>
            <Text style={styles.weightLossFactText}>
              Going Alcohol-Free can lead to 1-2 lbs weight loss per week!
            </Text>
          </View>
        )}

        {/* Weight Loss Progress Visual - Jar Visual */}
        <View style={styles.weightProgressCard}>
          <Text style={styles.weightProgressTitle}>Progress to Next Pound Lost</Text>
          <Text style={styles.weightProgressSubtitle}>
            {Math.round(progressPercent)}% complete • {currentCaloriesForJar.toLocaleString()}/{CALORIES_PER_POUND.toLocaleString()} calories saved
          </Text>
          
          {/* Reset Message */}
          {jarResetMessage !== '' && (
            <TouchableOpacity 
              style={styles.jarCelebrationCard}
              onPress={() => setJarResetMessage('')}
              activeOpacity={0.9}
            >
              <View style={styles.jarCelebrationHeader}>
                <Text style={styles.jarCelebrationEmoji}>🎉</Text>
                <Text style={styles.jarCelebrationTitle}>Milestone Achieved!</Text>
              </View>
              
              <View style={styles.jarCelebrationContent}>
                <Text style={styles.jarCelebrationMainText}>
                  You've reached {Math.floor(totalCaloriesSaved / CALORIES_PER_POUND)} lb{Math.floor(totalCaloriesSaved / CALORIES_PER_POUND) > 1 ? 's' : ''} lost!
                </Text>
                <Text style={styles.jarCelebrationSubText}>
                  Jar reset for next pound
                </Text>
              </View>
              
              <View style={styles.jarCelebrationReward}>
                <Text style={styles.jarRewardIcon}>🏅</Text>
                <Text style={styles.jarRewardText}>+50 Recoins</Text>
              </View>
              
              <Text style={styles.jarCelebrationDismiss}>Tap anywhere to continue</Text>
            </TouchableOpacity>
          )}
          
          
          {/* Jar Visual Container */}
          <View style={styles.jarContainer}>
            <View style={styles.jarLid}>
              <Text style={styles.jarLidText}>1 LB</Text>
            </View>
            
            <View style={styles.jarBody}>
              {/* Jar Fill - represents progress */}
              <View style={[
                styles.jarFill,
                { height: `${Math.max(5, progressPercent)}%` } // Minimum 5% to show something
              ]}>
                {/* Bubbles for visual interest */}
                {progressPercent > 5 && <View style={[styles.bubble, styles.bubble1]} />}
                {progressPercent > 20 && <View style={[styles.bubble, styles.bubble2]} />}
                {progressPercent > 40 && <View style={[styles.bubble, styles.bubble3]} />}
                {progressPercent > 60 && <View style={[styles.bubble, styles.bubble4]} />}
              </View>
              
              {/* Percentage Text Inside Jar */}
              <View style={styles.jarTextContainer}>
                <Text style={styles.jarProgressText}>{Math.round(progressPercent)}%</Text>
              </View>
            </View>
          </View>
          
          
          {caloriesSavedToday > 0 && (
            <Text style={styles.todayProgressText}>
              +{caloriesSavedToday} calories saved today!
            </Text>
          )}
        </View>

        {/* Weight-Loss Benefit - Always show a fun fact */}
        <View style={styles.afBenefitCard}>
          <View style={styles.afBenefitIcon}>
            <Text style={styles.afBenefitEmoji}>🌟</Text>
          </View>
          <Text style={styles.afBenefitTitle}>Did You Know?</Text>
          <Text style={styles.afBenefitText}>
            {getAFBenefit()}
          </Text>
        </View>

        {/* Scrollable Days */}
        <ScrollView 
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daysScrollView}
          contentContainerStyle={styles.daysScrollContent}
          snapToInterval={CARD_WIDTH}
          decelerationRate="fast"
          snapToAlignment="start"
        >
          {days.map((day, index) => {
            const dayOffset = index - todayIndex; // Calculate offset from today
            const dayInfo = getDayProgress(day.date, dayOffset);
            const isSelected = index === todayIndex + selectedDay;
            // Only pop out if selected, OR if it's today AND nothing else is selected
            const shouldPopOut = isSelected || (dayInfo.isToday && selectedDay === 0);
            return (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.dayCard,
                  shouldPopOut && styles.dayCardCentered,
                ]}
                onPress={() => handleDayPress(index)}
                activeOpacity={0.8}
              >
                {dayInfo.hasStreak ? (
                  <Text style={styles.fireIcon}>🔥</Text>
                ) : dayInfo.todayCompleted ? (
                  <Text style={styles.fireIcon}>🔥</Text>
                ) : (
                  <View style={styles.grayDot} />
                )}
                <Text style={[
                  styles.dayLabel,
                  dayInfo.isToday && styles.dayLabelToday,
                ]}>
                  {dayInfo.isToday ? 'Today' : dayInfo.weekday}
                </Text>
                <Text style={styles.dayNumber}>
                  {dayInfo.dayNumber}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Daily Tasks Section */}
        <TouchableOpacity 
          style={styles.tasksHeader}
          onPress={() => setTasksExpanded(!tasksExpanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.tasksTitle}>
            {selectedDay > 0 
              ? '📅 Future Daily Tasks' 
              : allTasksCompleted 
                ? '🎉 Daily Tasks Completed 🎉' 
                : '📋 Daily Tasks'
            }
          </Text>
          <Ionicons 
            name={tasksExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>

        {tasksExpanded && (
          <View style={styles.tasksContent}>
            {currentDayTasks.map((task) => {
              const isFutureDay = selectedDay > 0;
              return (
                <TouchableOpacity 
                  key={task.id} 
                  style={[
                    styles.taskCard,
                    task.completed && styles.taskCardCompleted,
                    isFutureDay && styles.taskCardDisabled,
                  ]}
                  onPress={() => !isFutureDay && handleTaskPress(task)}
                  activeOpacity={isFutureDay ? 1 : 0.8}
                  disabled={isFutureDay}
                >
                  <View style={styles.taskCheckbox}>
                    {task.completed ? (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    ) : (
                      <Ionicons name="ellipse-outline" size={24} color={isFutureDay ? "#ccc" : "#999"} />
                    )}
                  </View>
                <View style={styles.taskIcon}>
                  <Text style={styles.taskIconText}>{task.icon}</Text>
                </View>
                <View style={styles.taskInfo}>
                  <Text style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleCompleted,
                    isFutureDay && styles.taskTitleDisabled,
                  ]}>
                    {task.title}
                  </Text>
                  <Text style={[
                    styles.taskDuration,
                    isFutureDay && styles.taskDurationDisabled,
                  ]}>{task.duration}</Text>
                </View>
              </TouchableOpacity>
            )})}
          </View>
        )}

        {/* Weight-Loss Tip of the Day */}
        <View style={styles.tipOfDayCard}>
          <View style={styles.tipOfDayHeader}>
            <Text style={styles.tipOfDayIcon}>💡</Text>
            <Text style={styles.tipOfDayTitle}>Weight-Loss Tip</Text>
          </View>
          <Text style={styles.tipOfDayText}>
            {getDailyTip()}
          </Text>
        </View>

        {/* Daily Mini Workout */}
        <View style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <View style={styles.workoutHeaderLeft}>
              <Text style={styles.workoutTitle}>Today's Mini Workout 💪</Text>
              <Text style={styles.workoutSubtitle}>
                {todayWorkout.duration} min • Burns {todayWorkout.calories} calories
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.workoutCheckbox}
              onPress={toggleWorkoutCompletion}
              activeOpacity={0.8}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              {workoutCompleted ? (
                <View style={styles.workoutCheckboxCompleted}>
                  <Ionicons name="checkmark" size={16} color="#ffffff" />
                </View>
              ) : (
                <View style={styles.workoutCheckboxUncompleted} />
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.workoutContent}>
            <Text style={styles.workoutName}>{todayWorkout.name}</Text>
            <View style={styles.workoutExercises}>
              {todayWorkout.exercises.map((exercise, index) => (
                <Text key={index} style={styles.workoutExercise}>• {exercise}</Text>
              ))}
            </View>
            
            <View style={styles.burnADrinkContainer}>
              <Text style={styles.burnADrinkText}>
                Complete {Math.ceil(burnADrinkTime)}x to burn off one drink ({CALORIES_PER_DRINK} cal)
              </Text>
            </View>
          </View>
        </View>

        {/* Drink Logging Section */}
        <View style={styles.drinkSection}>
          <Text style={styles.drinkSectionTitle}>Track Your Progress</Text>
          

          {/* Drink Calendar */}
          <View style={styles.drinkCalendar}>
            {/* Calendar Content */}
            <View>
                <View style={styles.calendarHeader}>
                  <TouchableOpacity style={styles.monthNavButton}>
                    <Ionicons name="chevron-back" size={20} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.calendarTitle}>
                    {currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Text>
                  <TouchableOpacity style={styles.monthNavButton}>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
            
            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {/* Day Headers */}
              <View style={styles.dayHeadersRow}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <Text key={index} style={styles.dayHeader}>{day}</Text>
                ))}
              </View>
              
              {/* Calendar Days */}
              {(() => {
                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                const todayDate = today.getDate();
                
                // Get first day of month and number of days
                const firstDay = new Date(currentYear, currentMonth, 1);
                const lastDay = new Date(currentYear, currentMonth + 1, 0);
                const daysInMonth = lastDay.getDate();
                const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
                
                // Get real drink data from tracking hook
                // This will be empty initially until we connect to the database
                const getDrinkData = (day: number) => {
                  // Only show data for today if it exists
                  if (day === todayDate) {
                    // Always prioritize showing drinks if there are any
                    if (todayTotal > 0) {
                      return { 
                        isSober: false,
                        drinkCount: Math.round(todayTotal),
                        hasData: true
                      };
                    }
                    
                    // Check if task is completed and what type
                    const taskCompleted = taskStates[`task_drinks_0`] || false;
                    if (taskCompleted) {
                      // Use the drink status to determine what to show
                      if (todayDrinkStatus === 'logged') {
                        // Drinks were logged - show the stored count
                        const displayCount = Math.max(todayTotal, storedDrinkCount);
                        return { 
                          isSober: false,
                          drinkCount: Math.round(displayCount),
                          hasData: true
                        };
                      } else if (todayDrinkStatus === 'sober') {
                        // "No Drinks Today" was pressed
                        return { 
                          isSober: true,
                          drinkCount: 0,
                          hasData: true
                        };
                      }
                    }
                    
                    // No data for today yet
                    return { isSober: false, drinkCount: 0, hasData: false };
                  }
                  // Future days and past days without data show as empty
                  return { isSober: false, drinkCount: 0, hasData: false };
                };
                
                const weeks = [];
                let dayCounter = 1;
                
                // Calculate number of weeks needed
                const totalCells = startingDayOfWeek + daysInMonth;
                const numWeeks = Math.ceil(totalCells / 7);
                
                for (let weekIndex = 0; weekIndex < numWeeks; weekIndex++) {
                  const week = [];
                  
                  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                    const cellIndex = weekIndex * 7 + dayIndex;
                    
                    // Empty cells before month starts
                    if (cellIndex < startingDayOfWeek) {
                      week.push(<View key={`empty-${dayIndex}`} style={styles.calendarDayCell} />);
                    }
                    // Days of the month
                    else if (dayCounter <= daysInMonth) {
                      const currentDay = dayCounter;
                      const isToday = currentDay === todayDate;
                      const isPast = currentDay < todayDate;
                      const drinkData = getDrinkData(currentDay);
                      
                      // Only show green if explicitly marked as sober (task completed + no drinks)
                      let bgColor = '#ffffff';
                      if (isToday && drinkData.isSober) {
                        bgColor = '#10b981'; // Green for sober days
                      }
                      
                      week.push(
                        <TouchableOpacity 
                          key={`day-${currentDay}`}
                          style={[
                            styles.calendarDayCell,
                            isPast && styles.calendarDayCellPast,
                            isToday && styles.calendarDayCellToday,
                            isToday && drinkData.isSober && styles.calendarDayCellSober,
                            { backgroundColor: bgColor }
                          ]}
                        >
                          <Text style={[
                            styles.calendarDayNumber,
                            isToday && styles.todayNumber,
                            !isPast && !isToday && styles.futureNumber,
                            isToday && drinkData.isSober && styles.soberDayNumber
                          ]}>
                            {currentDay}
                          </Text>
                          {isToday && drinkData.hasData && (
                            drinkData.drinkCount > 0 ? (
                              <View style={styles.drinkCountBadge}>
                                <Text style={styles.drinkCountText}>{drinkData.drinkCount}</Text>
                              </View>
                            ) : drinkData.isSober ? (
                              <Text style={styles.calendarEmojiSober}>✨</Text>
                            ) : null
                          )}
                        </TouchableOpacity>
                      );
                      dayCounter++;
                    }
                    // Empty cells after month ends
                    else {
                      week.push(<View key={`empty-end-${dayIndex}`} style={styles.calendarDayCell} />);
                    }
                  }
                  
                  weeks.push(
                    <View key={`week-${weekIndex}`} style={styles.calendarWeekRow}>
                      {week}
                    </View>
                  );
                }
                
                return weeks;
              })()}
            </View>
              </View>
            
            <View style={styles.calendarFooter}>
              <TouchableOpacity 
                style={styles.logDrinksButton}
                onPress={() => router.push('/drink-logger')}
              >
                <Text style={styles.logDrinksButtonText}>Log Your Drinks</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Celebration Popup */}
      <Modal
        visible={showCelebration}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCelebration(false)}
      >
        <View style={styles.celebrationOverlay}>
          <View style={styles.celebrationContainer}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.celebrationCloseButton}
              onPress={() => setShowCelebration(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>

            {/* Confetti Elements */}
            <View style={styles.confettiContainer}>
              <Text style={[styles.confetti, styles.confetti1]}>🎉</Text>
              <Text style={[styles.confetti, styles.confetti2]}>⭐</Text>
              <Text style={[styles.confetti, styles.confetti3]}>✨</Text>
              <Text style={[styles.confetti, styles.confetti4]}>🎊</Text>
              <Text style={[styles.confetti, styles.confetti5]}>⭐</Text>
              <Text style={[styles.confetti, styles.confetti6]}>🎉</Text>
              <Text style={[styles.confetti, styles.confetti7]}>✨</Text>
              <Text style={[styles.confetti, styles.confetti8]}>🎊</Text>
            </View>

            {/* Main Content */}
            <View style={styles.celebrationContent}>
              <Text style={styles.celebrationTitle}>I've completed day</Text>
              
              {/* Fire Icon with Streak Number */}
              <View style={styles.fireStreakContainer}>
                <View style={styles.fireBackground}>
                  <Text style={styles.fireEmoji}>🔥</Text>
                  <View style={styles.streakBadge}>
                    <Text style={styles.streakBadgeNumber}>{newStreakCount}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.celebrationSubtitle}>
                on this journey to become the{'\n'}
                <Text style={styles.celebrationBold}>BEST version of myself!</Text>
              </Text>

              <View style={styles.celebrationDivider} />

              <Text style={styles.celebrationMessage}>
                {firstName}, congratulations on{'\n'}
                completing your daily activities!
              </Text>

              {/* Rewards */}
              <View style={styles.rewardContainer}>
                <Text style={styles.rewardIcon}>🏅</Text>
                <Text style={styles.rewardText}>+ 50 Recoins</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Increased top padding for status bar
    paddingBottom: 10,
  },
  coinsContainer: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  coinsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '300',
    color: '#1a1a1a',
    lineHeight: 36,
    marginBottom: 30,
  },
  userName: {
    fontWeight: '700',
  },
  testButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  testButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  streakContainer: {
    position: 'absolute',
    right: 20,
    top: 20, // Moved back to original position
  },
  streakCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  streakLabel: {
    fontSize: 10,
    color: '#ffffff',
  },
  daysScrollView: {
    marginHorizontal: -20,
    marginBottom: 30,
    height: 120, // Increased height to prevent clipping
    paddingVertical: 20, // Vertical padding for shadows
  },
  daysScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
    alignItems: 'center', // Center cards vertically
  },
  dayCard: {
    width: 70,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dayCardCentered: {
    transform: [{ scale: 1.4 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  fireIcon: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  grayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  dayLabelToday: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  dayNumber: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 2,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tasksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  tasksContent: {
    marginBottom: 20,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  taskCardCompleted: {
    opacity: 0.7,
  },
  taskCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#f8f8f8',
  },
  taskCheckbox: {
    marginRight: 12,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskIconText: {
    fontSize: 20,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskTitleDisabled: {
    color: '#ccc',
  },
  taskDuration: {
    fontSize: 14,
    color: '#999',
  },
  taskDurationDisabled: {
    color: '#ccc',
  },
  // Drink Logging Styles
  drinkSection: {
    marginTop: 10,
  },
  drinkSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  logDrinksCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logDrinksContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logDrinksIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  drinkEmoji: {
    fontSize: 24,
  },
  logDrinksText: {
    flex: 1,
  },
  logDrinksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  logDrinksSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logDrinksCheck: {
    padding: 4,
  },
  drinkCalendar: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthNavButton: {
    padding: 8,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  calendarGrid: {
    marginBottom: 16,
  },
  dayHeadersRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  calendarWeekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  calendarDayCell: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    margin: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  calendarDayCellPast: {
    borderColor: '#f0f0f0',
  },
  calendarDayCellToday: {
    borderWidth: 2,
    borderColor: '#4169e1',
  },
  calendarDayCellSober: {
    borderColor: 'transparent',
  },
  calendarDayNumber: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  todayNumber: {
    fontWeight: '700',
    color: '#4169e1',
  },
  futureNumber: {
    color: '#999',
  },
  soberDayNumber: {
    color: '#ffffff',
    fontWeight: '600',
  },
  calendarEmojiSober: {
    fontSize: 16,
    marginTop: 2,
    color: '#ffffff',
  },
  drinkCountBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  drinkCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  calendarFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  logDrinksButton: {
    backgroundColor: '#4169e1',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logDrinksButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Celebration Popup Styles
  celebrationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  celebrationContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    position: 'relative',
    minHeight: 450,
  },
  celebrationCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  confetti: {
    position: 'absolute',
    fontSize: 20,
  },
  confetti1: {
    top: 60,
    left: 30,
  },
  confetti2: {
    top: 80,
    right: 40,
  },
  confetti3: {
    top: 120,
    left: 60,
  },
  confetti4: {
    top: 140,
    right: 70,
  },
  confetti5: {
    top: 180,
    left: 40,
  },
  confetti6: {
    top: 200,
    right: 50,
  },
  confetti7: {
    top: 240,
    left: 70,
  },
  confetti8: {
    top: 260,
    right: 30,
  },
  celebrationContent: {
    alignItems: 'center',
    paddingTop: 40,
    zIndex: 2,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  fireStreakContainer: {
    marginBottom: 20,
  },
  fireBackground: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireEmoji: {
    fontSize: 120,
  },
  streakBadge: {
    position: 'absolute',
    bottom: 15,
    backgroundColor: '#1e3a8a',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  streakBadgeNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  celebrationBold: {
    fontWeight: '700',
    color: '#1e3a8a',
  },
  celebrationDivider: {
    width: 40,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
  },
  celebrationMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  rewardIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  // Drinks Summary Card Styles
  drinksSummaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  drinksSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drinksSummaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  drinksSummaryEmoji: {
    fontSize: 22,
  },
  drinksSummaryText: {
    flex: 1,
  },
  drinksSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  drinksSummaryCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  logDrinksQuickButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  logDrinksQuickButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  // Weight-Loss Feature Styles
  caloriesSavedCard: {
    backgroundColor: '#fef7f0',
    borderRadius: 16,
    padding: 14,
    marginTop: -8,
    marginBottom: 12,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  caloriesAFCard: {
    backgroundColor: '#ecfdf5',
    borderWidth: 3,
    borderColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  caloriesCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  caloriesEmoji: {
    fontSize: 20,
  },
  caloriesTextContainer: {
    flex: 1,
  },
  caloriesCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  caloriesCardNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ea580c',
  },
  celebrationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  celebrationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  celebrationEmoji: {
    fontSize: 20,
  },
  celebrationTextContainer: {
    flex: 1,
  },
  celebrationCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 2,
  },
  celebrationCardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#065f46',
  },
  weightLossFactCard: {
    backgroundColor: '#faf5ff',
    borderRadius: 16,
    padding: 14,
    marginTop: -6,
    marginBottom: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c4b5fd',
  },
  weightLossFactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#faf5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  weightLossFactEmoji: {
    fontSize: 20,
  },
  weightLossFactText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b21a8',
    textAlign: 'center',
    lineHeight: 20,
  },
  afBenefitCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  afBenefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  afBenefitEmoji: {
    fontSize: 22,
  },
  afBenefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  afBenefitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  tipOfDayCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    padding: 24,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#bfdbfe',
  },
  tipOfDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  tipOfDayIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipOfDayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  tipOfDayText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Weight Progress Jar Visual Styles
  weightProgressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  weightProgressTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  weightProgressSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 28,
    fontWeight: '500',
  },
  jarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  jarLid: {
    width: 90,
    height: 24,
    backgroundColor: '#475569',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -3,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  jarLidText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  jarBody: {
    width: 130,
    height: 170,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#e2e8f0',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  jarFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3b82f6',
    borderRadius: 17,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  jarTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  jarProgressText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e293b',
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: '#60a5fa',
    borderRadius: 50,
    opacity: 0.6,
  },
  bubble1: {
    width: 8,
    height: 8,
    top: 20,
    left: 20,
  },
  bubble2: {
    width: 6,
    height: 6,
    top: 40,
    right: 25,
  },
  bubble3: {
    width: 10,
    height: 10,
    top: 60,
    left: 30,
  },
  bubble4: {
    width: 7,
    height: 7,
    top: 10,
    right: 15,
  },
  poundsLostText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 8,
  },
  todayProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    textAlign: 'center',
  },
  jarCelebrationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginVertical: 16,
    borderWidth: 3,
    borderColor: '#fbbf24',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  jarCelebrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  jarCelebrationEmoji: {
    fontSize: 24,
    marginHorizontal: 8,
  },
  jarCelebrationTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  jarCelebrationContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  jarCelebrationMainText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 8,
  },
  jarCelebrationSubText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
  },
  jarCelebrationReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  jarRewardIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  jarRewardText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
  },
  jarCelebrationDismiss: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  totalPoundsLostText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
    textAlign: 'center',
    marginBottom: 16,
  },
  // Daily Workout Card Styles
  workoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  workoutHeaderLeft: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  workoutSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  workoutCheckbox: {
    padding: 8,
    borderRadius: 8,
  },
  workoutCheckboxCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    transform: [{ scale: 1 }],
  },
  workoutCheckboxUncompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    transform: [{ scale: 1 }],
  },
  workoutContent: {
    marginTop: 8,
  },
  workoutName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  workoutExercises: {
    marginBottom: 14,
  },
  workoutExercise: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 3,
    fontWeight: '500',
    paddingLeft: 4,
  },
  burnADrinkContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  burnADrinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
});