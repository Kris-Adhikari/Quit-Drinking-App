import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAlcoholTracking } from '@/hooks/use-alcohol-tracking';
import { useAuth } from '@/hooks/use-auth';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { loading, todayLogs, streakData, stats, resetStreak, refreshData } = useAlcoholTracking();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second for live counter
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate time since last drink
  const getTimeSinceLastDrink = () => {
    if (!streakData.last_drink_date) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const lastDrink = new Date(streakData.last_drink_date);
    const diff = currentTime.getTime() - lastDrink.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  const timeSinceLastDrink = getTimeSinceLastDrink();

  // Week days calculation
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  const currentDayIndex = today.getDay();
  
  // Calculate which days this week had drinks
  const getWeekStatus = () => {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - currentDayIndex);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekStatus = Array(7).fill(false);
    
    // For now, we'll mark days as alcohol-free based on current streak
    for (let i = 0; i <= currentDayIndex && i < streakData.current_streak; i++) {
      weekStatus[currentDayIndex - i] = true;
    }
    
    return weekStatus;
  };
  
  const weekStatus = getWeekStatus();

  const handleReset = () => {
    Alert.alert(
      'Reset Streak',
      'Are you sure you want to reset your streak? This will mark today as a drinking day.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetStreak();
            Alert.alert('Streak Reset', 'Your streak has been reset. Keep going, every day is a new opportunity!');
          },
        },
      ]
    );
  };

  const handleAddIntake = () => {
    router.push('/(tabs)/add-intake');
  };

  const handlePledge = () => {
    Alert.alert('Daily Pledge', 'I pledge to stay alcohol-free today!', [{ text: 'OK' }]);
  };

  const handleMeditate = () => {
    Alert.alert('Meditation', 'Meditation feature coming soon!', [{ text: 'OK' }]);
  };

  const handleMore = () => {
    Alert.alert('More Options', 'Additional features coming soon!', [{ text: 'OK' }]);
  };

  const handlePanicButton = () => {
    Alert.alert(
      'Need Support?',
      'Remember why you started this journey. Take deep breaths. You are stronger than any craving.',
      [
        { text: 'Call a Friend', onPress: () => {} },
        { text: 'Breathing Exercise', onPress: () => {} },
        { text: 'I\'m OK', style: 'cancel' },
      ]
    );
  };

  const handleSettings = () => {
    router.push('/(tabs)/settings');
  };

  const handleProgress = () => {
    router.push('/(tabs)/progress');
  };

  // Calculate brain rewiring progress (simplified - 90 days = 100%)
  const brainRewiringProgress = Math.min(100, Math.round((streakData.current_streak / 90) * 100));

  if (loading && !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>deriv</Text>
          <View style={styles.headerIcons}>
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={20} color="#FF6B6B" />
              <Text style={styles.streakText}>{streakData.current_streak}</Text>
            </View>
            <TouchableOpacity style={styles.iconButton} onPress={handleProgress}>
              <Ionicons name="stats-chart-outline" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
              <Ionicons name="settings-outline" size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Week Progress */}
        <View style={styles.weekContainer}>
          {weekDays.map((day, index) => (
            <View key={index} style={styles.dayWrapper}>
              <View
                style={[
                  styles.dayCircle,
                  weekStatus[index] && styles.dayCircleActive,
                  index === currentDayIndex && styles.dayCircleCurrent,
                ]}
              >
                {weekStatus[index] && index < currentDayIndex && (
                  <Ionicons name="checkmark" size={16} color="#ffffff" />
                )}
                {index === currentDayIndex && weekStatus[index] && (
                  <View style={styles.currentDayDot} />
                )}
              </View>
              <Text style={[styles.dayText, index === currentDayIndex && styles.dayTextCurrent]}>
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Main Circle */}
        <View style={styles.mainContent}>
          <TouchableOpacity onPress={handleAddIntake} activeOpacity={0.9}>
            <View style={styles.circleContainer}>
              <LinearGradient
                colors={['#E8D5FF', '#FFB6D9', '#FFE5EC', '#E8D5FF']}
                style={styles.gradientCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.innerCircle}>
                  {todayLogs.length > 0 ? (
                    <View style={styles.drinkCountContainer}>
                      <Text style={styles.drinkCount}>{todayLogs.reduce((sum, log) => sum + log.amount, 0)}</Text>
                      <Text style={styles.drinkLabel}>drinks today</Text>
                    </View>
                  ) : (
                    <Ionicons name="add" size={48} color="#8B5CF6" />
                  )}
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>

          <Text style={styles.statusText}>
            {todayLogs.length === 0 ? "You've been alcohol-free for:" : "Time since last drink:"}
          </Text>
          <Text style={styles.daysCount}>{timeSinceLastDrink.days} days</Text>
          <Text style={styles.timeDetails}>
            {timeSinceLastDrink.hours}hr {timeSinceLastDrink.minutes}m {timeSinceLastDrink.seconds}s
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handlePledge}>
            <MaterialCommunityIcons name="hand-wave" size={24} color="#1a1a1a" />
            <Text style={styles.actionButtonText}>Pledge</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleMeditate}>
            <MaterialCommunityIcons name="meditation" size={24} color="#1a1a1a" />
            <Text style={styles.actionButtonText}>Meditate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleReset}>
            <Ionicons name="refresh" size={24} color="#1a1a1a" />
            <Text style={styles.actionButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleMore}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#1a1a1a" />
            <Text style={styles.actionButtonText}>More</Text>
          </TouchableOpacity>
        </View>

        {/* Brain Rewiring Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Brain Rewiring</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${brainRewiringProgress}%` }]} />
            </View>
            <Text style={styles.progressPercent}>{brainRewiringProgress}%</Text>
          </View>
        </View>

        {/* Panic Button */}
        <TouchableOpacity style={styles.panicButton} onPress={handlePanicButton}>
          <Ionicons name="alert-circle-outline" size={24} color="#ffffff" />
          <Text style={styles.panicButtonText}>Panic Button</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -1,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  iconButton: {
    padding: 4,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  dayWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: '#8B5CF6',
  },
  dayCircleCurrent: {
    backgroundColor: '#6B46C1',
  },
  currentDayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  dayText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  dayTextCurrent: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  mainContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  circleContainer: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  gradientCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    padding: 4,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  innerCircle: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 96,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drinkCountContainer: {
    alignItems: 'center',
  },
  drinkCount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  drinkLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  statusText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  daysCount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -2,
  },
  timeDetails: {
    fontSize: 18,
    color: '#666666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  panicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  panicButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default Dashboard;