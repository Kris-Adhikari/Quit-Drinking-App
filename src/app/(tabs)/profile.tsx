import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAlcoholTracking } from '@/hooks/use-alcohol-tracking';
import { useAuth } from '@/hooks/use-auth';

// Achievement definitions
const achievementCategories = {
  streaks: {
    title: 'Streak Achievements',
    achievements: [
      {
        id: 'first_day',
        name: 'First Step',
        description: 'Complete your first day alcohol-free',
        requirement: 1,
        type: 'streak',
        badgeColor: '#4CAF50',
      },
      {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        requirement: 7,
        type: 'streak',
        badgeColor: '#2196F3',
      },
      {
        id: 'fortnight_fortress',
        name: 'Fortress',
        description: 'Achieve a 14-day streak',
        requirement: 14,
        type: 'streak',
        badgeColor: '#9C27B0',
      },
      {
        id: 'monthly_master',
        name: 'Trailblazer',
        description: 'Complete a 30-day streak',
        requirement: 30,
        type: 'streak',
        badgeColor: '#FF9800',
      },
      {
        id: 'diamond_days',
        name: 'Diamond',
        description: 'Reach a 60-day streak',
        requirement: 60,
        type: 'streak',
        badgeColor: '#00BCD4',
      },
      {
        id: 'emerald_elite',
        name: 'Emerald',
        description: 'Achieve a 90-day streak',
        requirement: 90,
        type: 'streak',
        badgeColor: '#4CAF50',
      },
    ],
  },
  monthly: {
    title: 'Monthly Progress',
    achievements: [
      {
        id: 'perfect_month',
        name: 'Perfect Month',
        description: 'Complete a month with 0 drinks',
        requirement: 100,
        type: 'monthly_percentage',
        badgeColor: '#FFD700',
      },
      {
        id: 'excellent_month',
        name: 'Excellent',
        description: 'Complete a month with 90%+ alcohol-free days',
        requirement: 90,
        type: 'monthly_percentage',
        badgeColor: '#8BC34A',
      },
      {
        id: 'great_month',
        name: 'Great Progress',
        description: 'Complete a month with 75%+ alcohol-free days',
        requirement: 75,
        type: 'monthly_percentage',
        badgeColor: '#03A9F4',
      },
      {
        id: 'good_start',
        name: 'Good Start',
        description: 'Complete a month with 50%+ alcohol-free days',
        requirement: 50,
        type: 'monthly_percentage',
        badgeColor: '#FF5722',
      },
    ],
  },
  milestones: {
    title: 'Special Milestones',
    achievements: [
      {
        id: 'first_week',
        name: 'Commitment',
        description: 'Track your progress for 7 days',
        requirement: 7,
        type: 'days_tracked',
        badgeColor: '#9E9E9E',
      },
      {
        id: 'habit_builder',
        name: 'Habit Builder',
        description: 'Track your progress for 21 days',
        requirement: 21,
        type: 'days_tracked',
        badgeColor: '#795548',
      },
      {
        id: 'consistency_king',
        name: 'Consistency',
        description: 'Track your progress for 100 days',
        requirement: 100,
        type: 'days_tracked',
        badgeColor: '#E91E63',
      },
    ],
  },
};

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const { streakData, stats } = useAlcoholTracking();

  // Calculate current month's alcohol-free percentage
  const getCurrentMonthPercentage = () => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    
    // For demo purposes, calculate based on current streak vs days passed
    const alcoholFreeDaysThisMonth = Math.min(streakData.current_streak, daysPassed);
    return Math.round((alcoholFreeDaysThisMonth / daysPassed) * 100);
  };

  const currentMonthPercentage = getCurrentMonthPercentage();

  // Check if achievement is unlocked
  const isAchievementUnlocked = (achievement: any) => {
    switch (achievement.type) {
      case 'streak':
        return streakData.current_streak >= achievement.requirement || streakData.longest_streak >= achievement.requirement;
      case 'monthly_percentage':
        return currentMonthPercentage >= achievement.requirement;
      case 'days_tracked':
        return stats.total_days_tracked >= achievement.requirement;
      default:
        return false;
    }
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log('Edit profile');
  };

  const handleSettings = () => {
    router.push('/(tabs)/settings');
  };

  const AchievementBadge = ({ achievement, unlocked }: { achievement: any; unlocked: boolean }) => (
    <TouchableOpacity style={styles.achievementItem} activeOpacity={0.8}>
      <View style={[
        styles.achievementBadge,
        { backgroundColor: unlocked ? achievement.badgeColor : '#E0E0E0' }
      ]}>
        <View style={[
          styles.achievementIcon,
          { backgroundColor: unlocked ? '#FFFFFF' : '#BDBDBD' }
        ]}>
          {unlocked && <Ionicons name="checkmark" size={16} color={achievement.badgeColor} />}
        </View>
      </View>
      <Text style={[
        styles.achievementName,
        { color: unlocked ? '#1a1a1a' : '#999999' }
      ]}>
        {achievement.name}
      </Text>
      <Text style={[
        styles.achievementDescription,
        { color: unlocked ? '#666666' : '#BBBBBB' }
      ]}>
        {achievement.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleEditProfile} style={styles.headerButton}>
            <Ionicons name="create-outline" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettings} style={styles.headerButton}>
            <Ionicons name="settings-outline" size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          
          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{streakData.current_streak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total_days_tracked}</Text>
              <Text style={styles.statLabel}>Days Tracked</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentMonthPercentage}%</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>
        </View>

        {/* Achievements Sections */}
        {Object.entries(achievementCategories).map(([categoryKey, category]) => (
          <View key={categoryKey} style={styles.achievementSection}>
            <Text style={styles.sectionTitle}>{category.title}</Text>
            <View style={styles.achievementGrid}>
              {category.achievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={isAchievementUnlocked(achievement)}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Progress Summary */}
        <View style={styles.progressSummary}>
          <Text style={styles.sectionTitle}>Your Journey</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Longest Streak</Text>
              <Text style={styles.progressValue}>{streakData.longest_streak} days</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Success Rate</Text>
              <Text style={styles.progressValue}>
                {stats.total_days_tracked > 0 
                  ? Math.round((stats.alcohol_free_days / stats.total_days_tracked) * 100)
                  : 0}%
              </Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Money Saved</Text>
              <Text style={styles.progressValue}>${stats.money_saved}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  achievementSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  achievementBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
  progressSummary: {
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
  },
  progressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressLabel: {
    fontSize: 16,
    color: '#666666',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});