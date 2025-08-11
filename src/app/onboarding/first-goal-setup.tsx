import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const alcoholGoals = [
  { id: 'skip_1_week', label: 'Avoid 1 beverage/week', calories: 140 },
  { id: 'skip_2_week', label: 'Avoid 2 beverages/week', calories: 280 },
  { id: 'skip_3_week', label: 'Avoid 3 beverages/week', calories: 420 },
  { id: 'skip_5_week', label: 'Avoid 5 beverages/week', calories: 700 },
];

const fitnessGoals = [
  { id: 'burn_150_week', label: 'Use 150 additional kcal/week', equivalent: '15 min stroll' },
  { id: 'burn_300_week', label: 'Use 300 additional kcal/week', equivalent: '30 min session' },
  { id: 'burn_500_week', label: 'Use 500 additional kcal/week', equivalent: '45 min movement' },
  { id: 'burn_750_week', label: 'Use 750 additional kcal/week', equivalent: '1 hour training' },
];

export default function FirstGoalSetup() {
  const router = useRouter();
  const [selectedAlcoholGoal, setSelectedAlcoholGoal] = useState<string | null>(null);
  const [selectedFitnessGoal, setSelectedFitnessGoal] = useState<string | null>(null);

  const handleFinish = () => {
    if (selectedAlcoholGoal && selectedFitnessGoal) {
      // Navigate to main app
      router.replace('/(tabs)/daily');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const progress = 22 / 22; // Final screen

  const getSelectedGoals = () => {
    const alcoholGoal = alcoholGoals.find(g => g.id === selectedAlcoholGoal);
    const fitnessGoal = fitnessGoals.find(g => g.id === selectedFitnessGoal);
    return { alcoholGoal, fitnessGoal };
  };

  const { alcoholGoal, fitnessGoal } = getSelectedGoals();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Time to establish your initial targets!</Text>
        <Text style={styles.subtitle}>
          Begin with realistic objectives that you can expand upon
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍷 Drinking Target</Text>
          <View style={styles.optionsContainer}>
            {alcoholGoals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalOption,
                  selectedAlcoholGoal === goal.id && styles.selectedGoalOption,
                ]}
                onPress={() => setSelectedAlcoholGoal(goal.id)}
                activeOpacity={0.7}
              >
                <View style={styles.goalContent}>
                  <Text
                    style={[
                      styles.goalLabel,
                      selectedAlcoholGoal === goal.id && styles.selectedGoalLabel,
                    ]}
                  >
                    {goal.label}
                  </Text>
                  <Text
                    style={[
                      styles.goalDetail,
                      selectedAlcoholGoal === goal.id && styles.selectedGoalDetail,
                    ]}
                  >
                    Save {goal.calories} calories
                  </Text>
                </View>
                <View style={[
                  styles.radioCircle,
                  selectedAlcoholGoal === goal.id && styles.radioCircleActive,
                ]}>
                  {selectedAlcoholGoal === goal.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏃‍♂️ Activity Objective</Text>
          <View style={styles.optionsContainer}>
            {fitnessGoals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalOption,
                  selectedFitnessGoal === goal.id && styles.selectedGoalOption,
                ]}
                onPress={() => setSelectedFitnessGoal(goal.id)}
                activeOpacity={0.7}
              >
                <View style={styles.goalContent}>
                  <Text
                    style={[
                      styles.goalLabel,
                      selectedFitnessGoal === goal.id && styles.selectedGoalLabel,
                    ]}
                  >
                    {goal.label}
                  </Text>
                  <Text
                    style={[
                      styles.goalDetail,
                      selectedFitnessGoal === goal.id && styles.selectedGoalDetail,
                    ]}
                  >
                    ~{goal.equivalent}
                  </Text>
                </View>
                <View style={[
                  styles.radioCircle,
                  selectedFitnessGoal === goal.id && styles.radioCircleActive,
                ]}>
                  {selectedFitnessGoal === goal.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {alcoholGoal && fitnessGoal && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Weekly Targets</Text>
            <View style={styles.summaryItem}>
              <Ionicons name="wine-outline" size={20} color="#1e3a8a" />
              <Text style={styles.summaryText}>{alcoholGoal.label}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="fitness-outline" size={20} color="#1e3a8a" />
              <Text style={styles.summaryText}>{fitnessGoal.label}</Text>
            </View>
            
            <View style={styles.successBox}>
              <View style={styles.successHeader}>
                <Ionicons name="trophy-outline" size={24} color="#1e3a8a" />
                <Text style={styles.successTitle}>Your Success Prediction</Text>
              </View>
              <Text style={styles.successRate}>People with your profile have a 94% success rate</Text>
              <Text style={styles.successText}>You're perfectly positioned to succeed.</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.finishButton,
            (!selectedAlcoholGoal || !selectedFitnessGoal) && styles.disabledButton
          ]}
          onPress={handleFinish}
          disabled={!selectedAlcoholGoal || !selectedFitnessGoal}
        >
          <Text style={styles.finishButtonText}>Begin My Transformation!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1e3a8a',
    borderRadius: 2,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  goalOption: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedGoalOption: {
    borderColor: '#1e3a8a',
    backgroundColor: '#f0f4ff',
  },
  goalContent: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  selectedGoalLabel: {
    color: '#1e3a8a',
  },
  goalDetail: {
    fontSize: 14,
    color: '#666',
  },
  selectedGoalDetail: {
    color: '#1e3a8a',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#1e3a8a',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1e3a8a',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 15,
    color: '#1a1a1a',
    flex: 1,
  },
  successBox: {
    marginTop: 24,
    backgroundColor: '#f0f9ff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    alignItems: 'center',
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  successRate: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: '#1e3a8a',
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  finishButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});