import React from 'react';
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
import { useUserProfile } from '@/hooks/use-user-profile';

export default function WelcomeProfile() {
  const router = useRouter();
  const { profile } = useUserProfile();

  const handleContinue = () => {
    router.push('/onboarding/relationship');
  };

  const handleBack = () => {
    router.back();
  };

  // Get the user's name from profile or use fallback
  const userName = profile?.name || "there";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4ff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>
            Welcome to{'\n'}Deriv, {userName}!
          </Text>
          
          <Text style={styles.subtitle}>
            Ready to change your life?
          </Text>
          
          <Text style={styles.description}>
            Let's get to know you better and{'\n'}personalize your plan!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            Let's dive in!
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
    width: 26,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d0d0d0',
  },
  progressDotActive: {
    backgroundColor: '#1a3a7b',
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
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1a3a7b',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 26,
  },
  continueButton: {
    backgroundColor: '#1a3a7b',
    paddingVertical: 18,
    borderRadius: 40,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});