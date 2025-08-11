import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const interferenceOptions = [
  'Constantly',
  'Frequently',
  'Occasionally',
  'Not at all'
];

export default function InterferenceFrequency() {
  const router = useRouter();
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');

  const handleFrequencySelect = (frequency: string) => {
    setSelectedFrequency(frequency);
  };

  const handleContinue = () => {
    router.push('/onboarding/relate-statement');
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
          <View style={[styles.progressFill, { width: `${20 / 22 * 100}%` }]} />
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>How frequently does drinking disrupt your daily routine?</Text>

        <View style={styles.optionsContainer}>
          {interferenceOptions.map((option, index) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionCard,
                selectedFrequency === option && styles.optionCardSelected
              ]}
              onPress={() => handleFrequencySelect(option)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.optionText,
                selectedFrequency === option && styles.optionTextSelected
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedFrequency && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!selectedFrequency}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedFrequency && styles.continueButtonTextDisabled
          ]}>
            Next
          </Text>
        </TouchableOpacity>
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 40,
    lineHeight: 36,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionCardSelected: {
    borderColor: '#1e3a8a',
    backgroundColor: '#f0f4ff',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'left',
  },
  optionTextSelected: {
    color: '#1e3a8a',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: '#f8f9fa',
  },
  continueButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#d0d0d0',
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