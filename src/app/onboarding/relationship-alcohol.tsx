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

const relationshipOptions = [
  { id: 'quit', label: 'I want to stop consuming alcohol' },
  { id: 'cut_back', label: 'I want to reduce my alcohol intake' },
  { id: 'alcohol_free', label: 'I want to maintain my sober lifestyle' },
  { id: 'not_sure', label: "I'm still deciding" },
];

export default function RelationshipAlcohol() {
  const router = useRouter();
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedRelationship) {
      router.push('/onboarding/reasons-and-goals');
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
          <View style={[styles.progressFill, { width: `${9 / 22 * 100}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What's your goal regarding alcohol consumption?</Text>

        <View style={styles.optionsContainer}>
          {relationshipOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedRelationship === option.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedRelationship(option.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionLabel,
                selectedRelationship === option.id && styles.optionLabelSelected,
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
              !selectedRelationship && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedRelationship}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.continueButtonText,
              !selectedRelationship && styles.continueButtonTextDisabled,
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