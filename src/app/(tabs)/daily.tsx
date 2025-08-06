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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getArticleForDay } from '@/data/alcohol-articles';

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
  const { user } = useAuth();
  const { streakData, incrementStreak, todayTotal, todayLogs, refreshData } = useAlcoholTracking();
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

  const CARD_WIDTH = 82; // Card width + gap

  // Today is always index 0 (since we start from today)
  const todayIndex = 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

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
        await loadTaskStates();
        await loadCoins();
        await refreshData(); // Refresh alcohol tracking data when screen gains focus
        
        // Check today's drink status and count
        try {
          const statusData = await AsyncStorage.getItem('todayDrinkStatus');
          const countDate = await AsyncStorage.getItem('todayDrinkCountDate');
          const today = new Date().toDateString();
          
          if (statusData) {
            const { date, status } = JSON.parse(statusData);
            if (date === today) {
              setTodayDrinkStatus(status);
            }
          }
          
          if (countDate === today) {
            const count = await AsyncStorage.getItem('todayDrinkCount');
            setStoredDrinkCount(count ? parseFloat(count) : 0);
          } else {
            setStoredDrinkCount(0);
          }
        } catch (error) {
          console.log('Error loading drink data:', error);
        }
      };
      loadData();
    }, [loadTaskStates, loadCoins, refreshData])
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
    } else if (dayOffset === 1) {
      baseTasks.push({
        id: `task3_${dayOffset}`,
        title: 'Reflection Journal',
        duration: '10 min',
        icon: '📝',
        completed: false,
        route: '/content/journal',
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
    const allCompleted = todayTasks.every(task => taskStates[task.id]);
    
    if (allCompleted && dayOffset === 0) { // Only for today
      const today = new Date().toDateString();
      
      // Check if we already completed today
      if (!dayCompleted[today]) {
        const newDayCompleted = {
          ...dayCompleted,
          [today]: true,
        };
        
        setDayCompleted(newDayCompleted);
        
        try {
          await AsyncStorage.setItem('completedDays', JSON.stringify(newDayCompleted));
          // Increment streak
          await incrementStreak();
          
          // Add reward coins
          await addCoins(50);
          
          // Show celebration popup
          setNewStreakCount(streakData.current_streak + 1);
          setShowCelebration(true);
        } catch (error) {
          console.log('Error saving day completion:', error);
        }
      }
    }
  }, [taskStates, dayCompleted, incrementStreak, addCoins, streakData.current_streak]);

  // Check day completion when task states change
  useEffect(() => {
    checkDayCompletion(0);
  }, [taskStates, checkDayCompletion]);

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

  // Get user's first name
  const firstName = user?.email?.split('@')[0] || 'User';

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
      if (task.route === '/daily-quote' || task.route === '/neuroplasticity-article') {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fb" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.coinsContainer}>
          <Text style={styles.coinsText}>🏅 {coins}</Text>
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

        {/* Test Button */}
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => {
            setNewStreakCount(streakData.current_streak + 1);
            setShowCelebration(true);
          }}
        >
          <Text style={styles.testButtonText}>TEST CELEBRATION</Text>
        </TouchableOpacity>

        {/* Streak Counter */}
        <View style={styles.streakContainer}>
          <View style={styles.streakCircle}>
            <Text style={styles.streakNumber}>{streakData.current_streak}</Text>
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
                {todayTotal === 0 ? 'No drinks logged' : 
                 todayTotal === 1 ? '1 drink' : 
                 `${todayTotal.toFixed(1)} drinks`}
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
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  drinksSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drinksSummaryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  drinksSummaryEmoji: {
    fontSize: 24,
  },
  drinksSummaryText: {
    flex: 1,
  },
  drinksSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  drinksSummaryCount: {
    fontSize: 14,
    color: '#666',
  },
  logDrinksQuickButton: {
    backgroundColor: '#4169e1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logDrinksQuickButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});