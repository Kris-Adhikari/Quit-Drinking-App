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

const locationOptions = [
  { id: 'country', label: 'The country' },
  { id: 'suburbs', label: 'The suburbs' },
  { id: 'city', label: 'A major city' },
];

export default function Location() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedLocation) {
      router.push('/onboarding/name');
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
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Which best describes the area you live in?</Text>
        <Text style={styles.subtitle}>
          Your environment can play a major role in your ability to break alcohol-related habits.
        </Text>

        <View style={styles.optionsContainer}>
          {locationOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedLocation === option.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedLocation(option.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionLabel,
                selectedLocation === option.id && styles.optionLabelSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedLocation && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedLocation}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.continueButtonText,
              !selectedLocation && styles.continueButtonTextDisabled,
            ]}>
              Continue
            </Text>
          </TouchableOpacity>
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
    width: 26,
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
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    marginBottom: 16,
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#f8f5ff',
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  optionLabelSelected: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  bottomContainer: {
    marginTop: 'auto',
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
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