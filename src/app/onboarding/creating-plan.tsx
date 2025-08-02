import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const steps = [
  'Analyzing your answers',
  'Creating your profile',
  'Adjusting the plan to your needs',
  'Creating your customized plan'
];

export default function CreatingPlan() {
  const router = useRouter();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    // Animate progress to 100% over 4 seconds
    progressAnim.addListener((value) => {
      setProgress(Math.round(value.value * 100));
      
      // Update completed steps based on progress
      if (value.value >= 0.25 && !completedSteps.includes(0)) {
        setCompletedSteps(prev => [...prev, 0]);
      }
      if (value.value >= 0.50 && !completedSteps.includes(1)) {
        setCompletedSteps(prev => [...prev, 1]);
      }
      if (value.value >= 0.75 && !completedSteps.includes(2)) {
        setCompletedSteps(prev => [...prev, 2]);
      }
      if (value.value >= 1 && !completedSteps.includes(3)) {
        setCompletedSteps(prev => [...prev, 3]);
      }
    });

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    }).start(() => {
      // Navigate after animation completes
      setTimeout(() => {
        router.push('/onboarding/look-at-plan');
      }, 500);
    });

    return () => {
      progressAnim.removeAllListeners();
    };
  }, []);

  const rotateAnimation = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4ff" />
      
      <View style={styles.header}>
        <View style={styles.backButtonPlaceholder} />
        <Text style={styles.headerTitle}>Personalization</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Creating Your Plan...</Text>
        <Text style={styles.subtitle}>
          We are finalizing your custom plan based on your answers and millions of data points from successful Reframers.
        </Text>

        <View style={styles.progressContainer}>
          {/* Percentage display */}
          <Text style={styles.progressText}>{progress}%</Text>
          
          {/* Animated progress bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={[
                styles.checkbox,
                completedSteps.includes(index) && styles.checkboxCompleted
              ]}>
                {completedSteps.includes(index) && (
                  <Ionicons name="checkmark" size={16} color="#1a3a7b" />
                )}
              </View>
              <Text style={[
                styles.stepText,
                completedSteps.includes(index) && styles.stepTextCompleted
              ]}>
                {step}
              </Text>
            </View>
          ))}
        </View>
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
  backButtonPlaceholder: {
    height: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a3a7b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 50,
    lineHeight: 26,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  progressBarContainer: {
    width: 300,
    height: 8,
    backgroundColor: '#e8d4f2',
    borderRadius: 4,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1a3a7b',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  stepsContainer: {
    width: '100%',
    gap: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d0d0d0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    borderColor: '#1a3a7b',
    backgroundColor: '#e8f0ff',
  },
  stepText: {
    fontSize: 18,
    color: '#666666',
    flex: 1,
  },
  stepTextCompleted: {
    color: '#1a3a7b',
    fontWeight: '600',
  },
});