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

const regretOptions = [
  { id: 'always', label: 'Always' },
  { id: 'often', label: 'Often' },
  { id: 'somewhat_often', label: 'Somewhat often' },
  { id: 'rarely', label: 'Rarely' },
  { id: 'never', label: 'Never' },
];

export default function Regret() {
  const router = useRouter();
  const [selectedRegret, setSelectedRegret] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedRegret) {
      router.push('/onboarding/typical-week');
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
        <Text style={styles.headerTitle}>Goal</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>After consuming a drink, how often do you feel regret?</Text>

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
    width: 32,
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
    marginBottom: 40,
    lineHeight: 36,
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
  alwaysOptionSelected: {
    borderColor: '#1a3a7b',
    backgroundColor: '#e8eaf6',
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
  alwaysOptionLabelSelected: {
    color: '#1a3a7b',
    fontWeight: '600',
  },
  bottomContainer: {
    marginTop: 'auto',
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#1a3a7b',
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