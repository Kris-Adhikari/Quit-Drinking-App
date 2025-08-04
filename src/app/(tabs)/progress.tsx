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

export default function Progress() {
  const router = useRouter();
  const { streakData, stats } = useAlcoholTracking();

  const handleBack = () => {
    router.back();
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Streak Stats */}
        <View style={styles.streakSection}>
          <Text style={styles.sectionTitle}>Streak Information</Text>
          
          <View style={styles.streakCards}>
            <View style={[styles.streakCard, styles.currentStreakCard]}>
              <Ionicons name="flame" size={32} color="#FF6B6B" />
              <Text style={styles.streakNumber}>{streakData.current_streak}</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
            
            <View style={[styles.streakCard, styles.longestStreakCard]}>
              <Ionicons name="trophy" size={32} color="#FFD700" />
              <Text style={styles.streakNumber}>{streakData.longest_streak}</Text>
              <Text style={styles.streakLabel}>Longest Streak</Text>
            </View>
          </View>
        </View>

        {/* Overall Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overall Statistics</Text>
          
          <View style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Days Tracked</Text>
              <Text style={styles.statValue}>{stats.total_days_tracked}</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Alcohol-Free Days</Text>
              <Text style={[styles.statValue, styles.successText]}>{stats.alcohol_free_days}</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Success Rate</Text>
              <Text style={[styles.statValue, styles.successText]}>
                {stats.total_days_tracked > 0 
                  ? Math.round((stats.alcohol_free_days / stats.total_days_tracked) * 100)
                  : 0}%
              </Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Avg. Drinks per Week</Text>
              <Text style={styles.statValue}>{stats.average_drinks_per_week}</Text>
            </View>
          </View>
        </View>

        {/* Savings */}
        <View style={styles.savingsSection}>
          <Text style={styles.sectionTitle}>Your Savings</Text>
          
          <View style={styles.savingsCards}>
            <View style={styles.savingsCard}>
              <Ionicons name="cash-outline" size={24} color="#4CAF50" />
              <Text style={styles.savingsAmount}>${formatNumber(stats.money_saved)}</Text>
              <Text style={styles.savingsLabel}>Money Saved</Text>
            </View>
            
            <View style={styles.savingsCard}>
              <Ionicons name="flame-outline" size={24} color="#FF9800" />
              <Text style={styles.savingsAmount}>{formatNumber(stats.calories_saved)}</Text>
              <Text style={styles.savingsLabel}>Calories Saved</Text>
            </View>
          </View>
        </View>

        {/* Motivational Message */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            {streakData.current_streak > 0 
              ? `Amazing! You've been alcohol-free for ${streakData.current_streak} days. Keep up the great work!`
              : "Every journey begins with a single step. Start your streak today!"}
          </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  streakSection: {
    marginBottom: 30,
  },
  streakCards: {
    flexDirection: 'row',
    gap: 16,
  },
  streakCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  currentStreakCard: {
    backgroundColor: '#FFF5F5',
  },
  longestStreakCard: {
    backgroundColor: '#FFFEF5',
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1a1a1a',
    marginVertical: 8,
  },
  streakLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statRow: {
    borderBottomWidth: 0,
  },
  statLabel: {
    fontSize: 16,
    color: '#666666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  successText: {
    color: '#4CAF50',
  },
  savingsSection: {
    marginBottom: 30,
  },
  savingsCards: {
    flexDirection: 'row',
    gap: 16,
  },
  savingsCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  savingsAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginVertical: 8,
  },
  savingsLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  motivationCard: {
    backgroundColor: '#E8F5FF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  motivationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1565C0',
    fontWeight: '500',
    textAlign: 'center',
  },
});