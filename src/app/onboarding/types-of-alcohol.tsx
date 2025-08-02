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

const alcoholTypes = [
  'Beer',
  'Wine',
  'Cocktails',
  'Spirits/Liquor',
  'Hard Seltzer',
  'Other'
];

export default function TypesOfAlcohol() {
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleContinue = () => {
    router.push('/onboarding/reasons-for-drinking');
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
        <Text style={styles.headerTitle}>Personalization</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What types of alcohol do you normally drink?</Text>
        <Text style={styles.subtitle}>This will help us personalize your plan.{'\n'}(Select all that apply)</Text>

        <View style={styles.optionsContainer}>
          {alcoholTypes.map((type, index) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionCard,
                selectedTypes.includes(type) && styles.optionCardSelected
              ]}
              onPress={() => handleTypeToggle(type)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.optionText,
                selectedTypes.includes(type) && styles.optionTextSelected
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedTypes.length === 0 && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={selectedTypes.length === 0}
          >
            <Text style={[
              styles.continueButtonText,
              selectedTypes.length === 0 && styles.continueButtonTextDisabled
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
    gap: 16,
    marginBottom: 40,
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
    borderColor: '#1a3a7b',
    backgroundColor: '#f0f4ff',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'left',
  },
  optionTextSelected: {
    color: '#1a3a7b',
  },
  bottomContainer: {
    marginTop: 'auto',
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: '#1a3a7b',
    paddingVertical: 16,
    borderRadius: 30,
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