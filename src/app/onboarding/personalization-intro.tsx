import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function PersonalizationIntro() {
  const router = useRouter();

  const handleStartPlan = () => {
    router.push('/onboarding/name');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${2 / 22 * 100}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>Perfect! You're all set</Text>
          <Text style={styles.subtitle}>
            Thousands of people have transformed{'\n'}
            their relationship with alcohol using{'\n'}
            our approach. Ready to customize yours?
          </Text>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartPlan}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Create My Personal Journey</Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  bottomContainer: {
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 20,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 30,
  },
  startButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});