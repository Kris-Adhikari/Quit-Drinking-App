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
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function PersonalizationIntro() {
  const router = useRouter();

  const handleStartPlan = () => {
    router.push('/onboarding/drinking-habits');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={['#4a69bd', '#3c5aa6']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#4a69bd" />
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity 
          onPress={handleBack} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.centerContent}>
            <Text style={styles.title}>You're in the right place</Text>
            <Text style={styles.subtitle}>
              We've helped 2M+ users to build{'\n'}
              healthier drinking habits. Now let's{'\n'}
              personalize your plan!
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartPlan}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start My Custom Plan</Text>
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 30,
    opacity: 0.9,
  },
  startButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    borderRadius: 40,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3c5aa6',
  },
});