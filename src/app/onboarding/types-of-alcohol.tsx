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

const alcoholTypes = [
  'Beer',
  'Wine',
  'Mixed Drinks',
  'Hard Liquor',
  'Seltzer (Hard)',
  'Something Else'
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
    router.push('/onboarding/previous-attempts');
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
          <View style={[styles.progressFill, { width: `${16 / 22 * 100}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Which alcoholic beverages do you usually consume?</Text>
        <Text style={styles.subtitle}>This helps us tailor your experience.{'\n'}(Choose any that apply)</Text>

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
      </ScrollView>

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