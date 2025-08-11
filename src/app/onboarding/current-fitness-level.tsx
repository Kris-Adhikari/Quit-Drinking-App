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

const fitnessLevels = [
  {
    id: 'sedentary',
    title: 'Mostly Inactive',
    description: 'Minimal physical activity',
    icon: 'bed-outline',
  },
  {
    id: 'lightly_active',
    title: 'Somewhat Active',
    description: 'Move around 1-2 times weekly',
    icon: 'walk-outline',
  },
  {
    id: 'moderately_active',
    title: 'Regularly Active',
    description: 'Workout 3-5 times weekly',
    icon: 'bicycle-outline',
  },
  {
    id: 'very_active',
    title: 'Highly Active',
    description: 'Daily movement and exercise',
    icon: 'barbell-outline',
  },
];

export default function CurrentFitnessLevel() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedLevel) {
      router.push('/onboarding/weight-goal');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const progress = 6 / 22; // 6th screen out of 22 total

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
        <Text style={styles.title}>How would you describe your activity level?</Text>
        <Text style={styles.subtitle}>
          Understanding your lifestyle helps us create better recommendations
        </Text>

        <View style={styles.optionsContainer}>
          {fitnessLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.option,
                selectedLevel === level.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedLevel(level.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Ionicons
                  name={level.icon as any}
                  size={32}
                  color={selectedLevel === level.id ? '#fff' : '#1e3a8a'}
                />
                <View style={styles.optionText}>
                  <Text
                    style={[
                      styles.optionTitle,
                      selectedLevel === level.id && styles.selectedOptionTitle,
                    ]}
                  >
                    {level.title}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      selectedLevel === level.id && styles.selectedOptionDescription,
                    ]}
                  >
                    {level.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !selectedLevel && styles.disabledButton]}
          onPress={handleNext}
          disabled={!selectedLevel}
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