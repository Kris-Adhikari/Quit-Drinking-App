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

const attemptOptions = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
];

export default function PreviousAttempts() {
  const router = useRouter();
  const [selectedAttempt, setSelectedAttempt] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedAttempt) {
      router.push('/onboarding/regret');
    }
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
          <View style={[styles.progressFill, { width: `${17 / 22 * 100}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.topSection}>
          <Text style={styles.title}>Your past experiences are valuable data</Text>
          <Text style={styles.empowerment}>
            Whether you've tried before or not, you now have science-backed support designed for lasting success.
          </Text>
          <Text style={styles.question}>Have you previously attempted to reduce or stop alcohol consumption?</Text>
        </View>

        <View style={styles.optionsContainer}>
          {attemptOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedAttempt === option.id && styles.optionCardSelected,
                option.id === 'yes' && selectedAttempt === 'yes' && styles.yesOptionSelected,
              ]}
              onPress={() => setSelectedAttempt(option.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionLabel,
                selectedAttempt === option.id && styles.optionLabelSelected,
                option.id === 'yes' && selectedAttempt === 'yes' && styles.yesOptionLabelSelected,
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
              !selectedAttempt && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedAttempt}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.continueButtonText,
              !selectedAttempt && styles.continueButtonTextDisabled,
            ]}>
              Next
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
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 36,
  },
  empowerment: {
    fontSize: 16,
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    backgroundColor: '#f0f4ff',
    padding: 12,
    borderRadius: 8,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 40,
    lineHeight: 28,
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
    borderColor: '#1e3a8a',
    backgroundColor: '#f0f4ff',
  },
  yesOptionSelected: {
    borderColor: '#1e3a8a',
    backgroundColor: '#f0f4ff',
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  optionLabelSelected: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  yesOptionLabelSelected: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  bottomContainer: {
    marginTop: 'auto',
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    borderRadius: 12,
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