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

export default function AnalyzingAnswers() {
  const router = useRouter();
  const profileProgress = useRef(new Animated.Value(0)).current;
  const goalProgress = useRef(new Animated.Value(0)).current;
  const personalizationProgress = useRef(new Animated.Value(0)).current;
  
  const [profilePercent, setProfilePercent] = useState(0);
  const [goalPercent, setGoalPercent] = useState(0);
  const [personalizationPercent, setPersonalizationPercent] = useState(0);

  useEffect(() => {
    // Set up listeners for percentage updates
    profileProgress.addListener((value) => {
      setProfilePercent(Math.round(value.value * 100));
    });
    goalProgress.addListener((value) => {
      setGoalPercent(Math.round(value.value * 100));
    });
    personalizationProgress.addListener((value) => {
      setPersonalizationPercent(Math.round(value.value * 100));
    });

    // Animate progress bars sequentially
    Animated.sequence([
      // Profile animation to 60%
      Animated.timing(profileProgress, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      // Goal animation to 100%
      Animated.timing(goalProgress, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      // Personalization animation to 100%
      Animated.timing(personalizationProgress, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Navigate after animations complete
      setTimeout(() => {
        router.push('/onboarding/last-question');
      }, 500);
    });

    return () => {
      profileProgress.removeAllListeners();
      goalProgress.removeAllListeners();
      personalizationProgress.removeAllListeners();
    };
  }, []);

  const profileWidth = profileProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const goalWidth = goalProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const personalizationWidth = personalizationProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4ff" />
      
      <View style={styles.header}>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Analyzing Your Answers...</Text>
        <Text style={styles.subtitle}>
          Almost there! Give us a moment to analyze your answers.
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Profile</Text>
              <Text style={styles.progressPercent}>
              {profilePercent}%
            </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { width: profileWidth },
                ]}
              />
            </View>
          </View>

          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Goal</Text>
              <Text style={styles.progressPercent}>
              {goalPercent}%
            </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { width: goalWidth },
                ]}
              />
            </View>
          </View>

          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Personalization</Text>
              <Text style={styles.progressPercent}>
              {personalizationPercent}%
            </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { width: personalizationWidth },
                ]}
              />
            </View>
          </View>
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
  },
  backButtonPlaceholder: {
    height: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 60,
    lineHeight: 26,
  },
  progressContainer: {
    gap: 40,
  },
  progressItem: {
    gap: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a3a7b',
  },
  progressPercent: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a3a7b',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e8e8e8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1a3a7b',
    borderRadius: 4,
  },
});