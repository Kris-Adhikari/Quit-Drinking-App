import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const weekDays = ['S', 'S', 'M', 'T', 'W', 'T', 'F'];
  const currentDay = 3; // Tuesday (0-indexed)

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
              <Text style={styles.streakText}>3</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="heart-outline" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
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
                  index <= currentDay && styles.dayCircleActive,
                  index === currentDay && styles.dayCircleCurrent,
                ]}
              >
                {index < currentDay && (
                  <Ionicons name="checkmark" size={16} color="#ffffff" />
                )}
                {index === currentDay && (
                  <View style={styles.currentDayDot} />
                )}
              </View>
              <Text style={[styles.dayText, index === currentDay && styles.dayTextCurrent]}>
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Main Circle */}
        <View style={styles.mainContent}>
          <View style={styles.circleContainer}>
            <LinearGradient
              colors={['#E8D5FF', '#FFB6D9', '#FFE5EC', '#E8D5FF']}
              style={styles.gradientCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.innerCircle} />
            </LinearGradient>
          </View>

          <Text style={styles.statusText}>You've been alcohol-free for:</Text>
          <Text style={styles.daysCount}>9 days</Text>
          <Text style={styles.timeDetails}>20hr 12m 37s</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="hand-wave" size={24} color="#1a1a1a" />
            <Text style={styles.actionButtonText}>Pledge</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="meditation" size={24} color="#1a1a1a" />
            <Text style={styles.actionButtonText}>Meditate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="refresh" size={24} color="#1a1a1a" />
            <Text style={styles.actionButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#1a1a1a" />
            <Text style={styles.actionButtonText}>More</Text>
          </TouchableOpacity>
        </View>

        {/* Brain Rewiring Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Brain Rewiring</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '11%' }]} />
            </View>
            <Text style={styles.progressPercent}>11%</Text>
          </View>
        </View>

        {/* Panic Button */}
        <TouchableOpacity style={styles.panicButton}>
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