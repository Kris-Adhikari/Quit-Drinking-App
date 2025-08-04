import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PlanResults() {
  const router = useRouter();

  // Mock data based on typical onboarding responses (could be passed as props or from context)
  const userResponses = {
    drinksPerWeek: 20, // Default from typical-week page
    averageCostPerWeek: 30, // Default from typical-week page
    alcoholTypes: ['Beer', 'Wine'], // Mock selected types
  };

  // Calculate metrics with some optimistic overexaggeration
  const metrics = useMemo(() => {
    const { drinksPerWeek, averageCostPerWeek } = userResponses;
    
    // Money savings (assume 70% reduction in drinking)
    const reductionRate = 0.7;
    const weeklySavings = averageCostPerWeek * reductionRate;
    const yearlySavings = Math.round(weeklySavings * 52);
    
    // Calories cut (estimate based on average drink calories)
    // Beer: ~150 cal, Wine: ~125 cal, Spirits: ~100 cal, assume mixed drinks
    const avgCaloriesPerDrink = 140;
    const weeklyCaloriesCut = drinksPerWeek * avgCaloriesPerDrink * reductionRate;
    const yearlyCaloriesCut = Math.round(weeklyCaloriesCut * 52);
    
    // REM cycles (alcohol disrupts sleep, assume 0.5 additional REM cycles per night without alcohol)
    // With reduced drinking, estimate better sleep quality
    const nightsWithBetterSleep = 5; // nights per week with reduced drinking
    const remCyclesPerNight = 0.8;
    const weeklyRemImprovement = nightsWithBetterSleep * remCyclesPerNight;
    const yearlyRemCycles = Math.round(weeklyRemImprovement * 52);
    
    return {
      savings: yearlySavings,
      calories: yearlyCaloriesCut,
      remCycles: yearlyRemCycles,
    };
  }, [userResponses]);

  const handleContinue = () => {
    router.push('/onboarding/plan-effects');
  };

  const handleBack = () => {
    router.back();
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <LinearGradient
      colors={['#4A6CF7', '#2E4BC7']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#4A6CF7" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.timeframe}>In 365 days</Text>
            <Text style={styles.title}>
              Here's what you can look forward to with our help.
            </Text>
          </View>

          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>You're going to save</Text>
              <Text style={styles.metricValue}>${formatNumber(metrics.savings)}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>You're going to cut</Text>
              <Text style={styles.metricValue}>{formatNumber(metrics.calories)} Cal</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Numbers of REM cycles you're going to add</Text>
              <Text style={styles.metricValue}>{formatNumber(metrics.remCycles)}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-forward" size={32} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 60,
  },
  timeframe: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 36,
  },
  metricsContainer: {
    gap: 20,
  },
  metricCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  metricLabel: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
  },
  metricValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 56,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  continueButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});