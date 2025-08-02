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

const frequencyOptions = [
  'Often',
  'Sometimes',
  'Never'
];

export default function LastQuestion() {
  const router = useRouter();
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');

  const handleFrequencySelect = (frequency: string) => {
    setSelectedFrequency(frequency);
    // Navigate immediately after selection
    setTimeout(() => {
      router.push('/onboarding/creating-plan');
    }, 300);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333333" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.preTitle}>And lastly,</Text>
          <Text style={styles.title}>How often do you drink more than you intend to?</Text>

          <View style={styles.optionsContainer}>
            {frequencyOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  selectedFrequency === option && styles.optionButtonSelected
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
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 40,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  preTitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 36,
  },
  optionsContainer: {
    width: '100%',
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#e8e8e8',
  },
  optionButtonSelected: {
    borderColor: '#1a3a7b',
    backgroundColor: '#ffffff',
  },
  optionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#1a3a7b',
  },
});