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

const regretOptions = [
  { id: 'always', label: 'Every time' },
  { id: 'often', label: 'Frequently' },
  { id: 'somewhat_often', label: 'Sometimes' },
  { id: 'rarely', label: 'Rarely' },
  { id: 'never', label: 'Not at all' },
];

export default function Regret() {
  const router = useRouter();
  const [selectedRegret, setSelectedRegret] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedRegret) {
      router.push('/onboarding/drinking-habits');
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
          <View style={[styles.progressFill, { width: `${18 / 22 * 100}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your self-awareness is your strength</Text>
        <Text style={styles.empowerment}>
          Recognizing these feelings shows you're ready for real change.
        </Text>
        <Text style={styles.question}>Following alcohol consumption, how frequently do you experience remorse?</Text>

        <View style={styles.optionsContainer}>
          {regretOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedRegret === option.id && styles.optionCardSelected,
                option.id === 'always' && selectedRegret === 'always' && styles.alwaysOptionSelected,
              ]}
              onPress={() => setSelectedRegret(option.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionLabel,
                selectedRegret === option.id && styles.optionLabelSelected,
                option.id === 'always' && selectedRegret === 'always' && styles.alwaysOptionLabelSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedRegret && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedRegret}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.continueButtonText,
              !selectedRegret && styles.continueButtonTextDisabled,
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
    flexGrow: 1,
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
  alwaysOptionSelected: {
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
  alwaysOptionLabelSelected: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  bottomContainer: {
    marginTop: 'auto',
    padding: 20,
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