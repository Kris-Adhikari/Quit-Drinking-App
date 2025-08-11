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

export default function ValueProp3() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboarding/welcome');
  };

  const handleSkip = () => {
    router.push('/onboarding/welcome');
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
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Ionicons name="analytics" size={120} color="#1e3a8a" />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.headline}>Track progress, calories saved, and workouts</Text>
          <Text style={styles.subheadline}>See your transformation in real-time</Text>
          
          <Text style={styles.body}>
            Watch your progress with detailed tracking of calories saved and fitness gained. Every sober day brings you closer to your dream body.
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>
          
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Get Started</Text>
            <Ionicons name="chevron-forward" size={20} color="#ffffff" />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
    alignItems: 'center',
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  subheadline: {
    fontSize: 18,
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  activeDot: {
    backgroundColor: '#1e3a8a',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    minWidth: 200,
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
});