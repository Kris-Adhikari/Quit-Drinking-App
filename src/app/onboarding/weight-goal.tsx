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

const weightGoals = [
  {
    id: 'lose_weight',
    title: 'Drop Weight',
    description: 'Reduce body weight and feel energized',
    icon: 'trending-down-outline',
    color: '#1e3a8a',
  },
  {
    id: 'maintain',
    title: 'Stay Current',
    description: 'Maintain my present healthy state',
    icon: 'remove-outline',
    color: '#1e3a8a',
  },
  {
    id: 'gain_muscle',
    title: 'Build Muscle',
    description: 'Increase strength and lean tissue',
    icon: 'trending-up-outline',
    color: '#1e3a8a',
  },
];

export default function WeightGoal() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedGoal) {
      router.push('/onboarding/alcohol-impact-on-goals');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const progress = 7 / 22; // 7th screen out of 22 total

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
        <Text style={styles.title}>What body composition goal interests you?</Text>
        <Text style={styles.subtitle}>
          Understanding your goals helps us show alcohol's impact on progress
        </Text>

        <View style={styles.optionsContainer}>
          {weightGoals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.option,
                selectedGoal === goal.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedGoal(goal.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: goal.color + '20' },
                    selectedGoal === goal.id && styles.selectedIconContainer,
                  ]}
                >
                  <Ionicons
                    name={goal.icon as any}
                    size={28}
                    color={selectedGoal === goal.id ? '#fff' : goal.color}
                  />
                </View>
                <View style={styles.optionText}>
                  <Text
                    style={[
                      styles.optionTitle,
                      selectedGoal === goal.id && styles.selectedOptionTitle,
                    ]}
                  >
                    {goal.title}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      selectedGoal === goal.id && styles.selectedOptionDescription,
                    ]}
                  >
                    {goal.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            Drinking affects your body composition goals - let us demonstrate the connection
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !selectedGoal && styles.disabledButton]}
          onPress={handleNext}
          disabled={!selectedGoal}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
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
    marginBottom: 40,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 16,
  },
  option: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  selectedOptionTitle: {
    color: '#fff',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});