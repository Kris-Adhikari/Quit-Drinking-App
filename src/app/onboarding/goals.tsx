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

const goalOptions = [
  { 
    id: 'quit', 
    label: 'Quit completely', 
    description: 'I want to stop drinking alcohol entirely',
    icon: 'close-circle',
  },
  { 
    id: 'reduce', 
    label: 'Reduce intake', 
    description: 'I want to drink less than I currently do',
    icon: 'trending-down',
  },
  { 
    id: 'control', 
    label: 'Better control', 
    description: 'I want to have more control over my drinking',
    icon: 'shield-checkmark',
  },
  { 
    id: 'health', 
    label: 'Improve health', 
    description: 'I want to reduce alcohol for health reasons',
    icon: 'fitness',
  },
];

export default function Goals() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedGoal) {
      // Complete onboarding and go to main app
      router.replace('/(tabs)/daily');
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
        <Text style={styles.headerTitle}>Personalization</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What's your goal?</Text>
        <Text style={styles.subtitle}>
          We'll help you achieve it with personalized support
        </Text>

        <View style={styles.goalsContainer}>
          {goalOptions.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                selectedGoal === goal.id && styles.goalCardSelected,
              ]}
              onPress={() => setSelectedGoal(goal.id)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.goalIconContainer,
                selectedGoal === goal.id && styles.goalIconContainerSelected,
              ]}>
                <Ionicons
                  name={goal.icon as any}
                  size={24}
                  color={selectedGoal === goal.id ? '#8B5CF6' : '#666666'}
                />
              </View>
              <View style={styles.goalContent}>
                <Text style={[
                  styles.goalLabel,
                  selectedGoal === goal.id && styles.goalLabelSelected,
                ]}>
                  {goal.label}
                </Text>
                <Text style={[
                  styles.goalDescription,
                  selectedGoal === goal.id && styles.goalDescriptionSelected,
                ]}>
                  {goal.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedGoal && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedGoal}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedGoal && styles.continueButtonTextDisabled,
          ]}>
            Complete Setup
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
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a3a7b',
    marginTop: 20,
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressDot: {
    width: 32,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d0d0d0',
  },
  progressDotActive: {
    backgroundColor: '#1a3a7b',
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
  goalsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  goalCardSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#f8f5ff',
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  goalIconContainerSelected: {
    backgroundColor: '#ede7ff',
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
  goalLabelSelected: {
    color: '#8B5CF6',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  goalDescriptionSelected: {
    color: '#7c5ab8',
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