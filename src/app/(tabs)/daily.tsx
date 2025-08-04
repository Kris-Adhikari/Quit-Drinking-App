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
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const { streakData, incrementStreak } = useAlcoholTracking();
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(0); // 0 is today
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Store task completion states
  const [taskStates, setTaskStates] = useState<{[key: string]: boolean}>({});
  const [dayCompleted, setDayCompleted] = useState<{[key: string]: boolean}>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [newStreakCount, setNewStreakCount] = useState(0);

  const CARD_WIDTH = 82; // Card width + gap

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Scroll to today on mount
  useEffect(() => {
    const todayIndex = streakData.current_streak;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: todayIndex * CARD_WIDTH, animated: false });
    }, 100);
  }, [streakData.current_streak]);

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

  // Reload task states when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTaskStates();
    }, [loadTaskStates])
  );

  // Check day completion when task states change
  useEffect(() => {
    checkDayCompletion(0);
  }, [taskStates, checkDayCompletion]);

  const handleDayPress = (index: number) => {
    const dayOffset = index - streakData.current_streak;
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

  // Generate tasks for different days
  const getTasksForDay = (dayOffset: number): Task[] => {
    const baseTasks = [
      {
        id: `task1_${dayOffset}`,
        title: 'Changing Our Brains Through Neuroplasticity',
        duration: '3 min read',
        icon: '📚',
        completed: false,
        route: '/neuroplasticity-article',
      },
      {
        id: `task2_${dayOffset}`,
        title: 'Daily Motivation',
        duration: '1 min read',
        icon: '💡',
        completed: false,
        route: '/daily-quote',
      },
    ];

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

  // Generate days array (only show streak days, today, and future days)
  const generateDays = (): DayData[] => {
    const days: DayData[] = [];
    const currentStreak = streakData.current_streak;
    
    // Show past streak days (Day 1, Day 2, etc.)
    for (let i = -currentStreak; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date,
        tasks: getTasksForDay(i),
      });
    }
    return days;
  };

  const days = generateDays();
  const currentDayTasks = days.find((_, index) => index === selectedDay + streakData.current_streak)?.tasks || [];
  const allTasksCompleted = currentDayTasks.every(task => task.completed);

  // Get progress for a specific day
  const getDayProgress = (dayOffset: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDay = new Date(today);
    targetDay.setDate(targetDay.getDate() + dayOffset);
    
    // Check if day has streak
    const hasStreak = dayOffset < 0 && dayOffset >= -streakData.current_streak;
    const isToday = dayOffset === 0;
    const isFuture = dayOffset > 0;
    
    // Check if today's tasks are all completed
    const todayCompleted = isToday && dayCompleted[targetDay.toDateString()];
    
    // Get weekday abbreviation and day number
    const weekday = targetDay.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dayNumber = targetDay.getDate();

    return { hasStreak, isToday, isFuture, todayCompleted, weekday, dayNumber, dayOffset };
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
          
          // Show celebration popup
          setNewStreakCount(streakData.current_streak + 1);
          setShowCelebration(true);
        } catch (error) {
          console.log('Error saving day completion:', error);
        }
      }
    }
  }, [taskStates, dayCompleted, incrementStreak]);

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
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="menu" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="bookmark-outline" size={24} color="#666" />
        </TouchableOpacity>
        <View style={styles.coinsContainer}>
          <Text style={styles.coinsText}>🏅 435</Text>
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
            const dayInfo = getDayProgress(index - streakData.current_streak);
            const isSelected = index === selectedDay + streakData.current_streak;
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
                {dayInfo.hasStreak || dayInfo.todayCompleted ? (
                  <Text style={styles.fireIcon}>🔥</Text>
                ) : (
                  <View style={styles.grayDot} />
                )}
                <Text style={[
                  styles.dayLabel,
                  dayInfo.isToday && styles.dayLabelToday,
                ]}>
                  {dayInfo.isToday ? 'Today' : dayInfo.isFuture ? 'Day ' + (streakData.current_streak + dayInfo.dayOffset + 1) : 'Day ' + (streakData.current_streak + dayInfo.dayOffset + 1)}
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
            {allTasksCompleted ? '🎉 Daily Tasks Completed 🎉' : '📋 Daily Tasks'}
          </Text>
          <Ionicons 
            name={tasksExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>

        {tasksExpanded && (
          <View style={styles.tasksContent}>
            {currentDayTasks.map((task) => (
              <TouchableOpacity 
                key={task.id} 
                style={[
                  styles.taskCard,
                  task.completed && styles.taskCardCompleted,
                ]}
                onPress={() => handleTaskPress(task)}
                activeOpacity={0.8}
              >
                <TouchableOpacity 
                  style={styles.taskCheckbox}
                  onPress={() => toggleTaskCompletion(task.id)}
                >
                  {task.completed ? (
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={24} color="#999" />
                  )}
                </TouchableOpacity>
                <View style={styles.taskIcon}>
                  <Text style={styles.taskIconText}>{task.icon}</Text>
                </View>
                <View style={styles.taskInfo}>
                  <Text style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleCompleted,
                  ]}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskDuration}>{task.duration}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bonus Daily Research */}
        <View style={styles.bonusSection}>
          <Text style={styles.bonusTitle}>Bonus: Daily Research</Text>
          
          <TouchableOpacity style={styles.guideCard} activeOpacity={0.8}>
            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>The Ultimate Sober October Guide</Text>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>Explore</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.guideDecoration}>
              <Text style={styles.leafEmoji}>🍂</Text>
              <Text style={styles.leafEmoji2}>🍁</Text>
            </View>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Increased top padding for status bar
    paddingBottom: 10,
  },
  headerIcon: {
    padding: 8,
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
  taskDuration: {
    fontSize: 14,
    color: '#999',
  },
  bonusSection: {
    marginTop: 10,
  },
  bonusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  guideCard: {
    backgroundColor: '#ff6b35',
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  guideContent: {
    zIndex: 2,
  },
  guideTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    maxWidth: '70%',
  },
  exploreButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff6b35',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  guideDecoration: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  leafEmoji: {
    fontSize: 48,
    position: 'absolute',
    right: 0,
    bottom: 0,
    transform: [{ rotate: '15deg' }],
  },
  leafEmoji2: {
    fontSize: 36,
    position: 'absolute',
    right: 40,
    bottom: 30,
    transform: [{ rotate: '-20deg' }],
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
});