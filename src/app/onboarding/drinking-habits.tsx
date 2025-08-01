import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const drinkingOptions = [
  { id: 'daily', label: 'Daily', description: 'I drink alcohol every day' },
  { id: 'weekly', label: 'Weekly', description: 'Several times a week' },
  { id: 'occasional', label: 'Occasional', description: 'Once a week or less' },
  { id: 'social', label: 'Social only', description: 'Only at social events' },
  { id: 'rarely', label: 'Rarely', description: 'Very infrequently' },
];

export default function DrinkingHabits() {
  const router = useRouter();
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedHabit) {
      router.push('/onboarding/triggers');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4ff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How often do you drink?</Text>
        <Text style={styles.subtitle}>
          This helps us understand your current habits
        </Text>

        <View style={styles.optionsContainer}>
          {drinkingOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedHabit === option.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedHabit(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionLabel,
                  selectedHabit === option.id && styles.optionLabelSelected,
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  selectedHabit === option.id && styles.optionDescriptionSelected,
                ]}>
                  {option.description}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedHabit === option.id && styles.radioButtonSelected,
              ]}>
                {selectedHabit === option.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedHabit && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedHabit}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedHabit && styles.continueButtonTextDisabled,
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
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
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
  },
  optionsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  optionCardSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#f8f5ff',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: '#8B5CF6',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
  },
  optionDescriptionSelected: {
    color: '#8B5CF6',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioButtonSelected: {
    borderColor: '#8B5CF6',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B5CF6',
  },
  continueButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  continueButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  continueButtonTextDisabled: {
    color: '#999999',
  },
});