import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const reasonsAndGoals = [
  {
    id: 'health',
    title: 'Boost my physical wellness',
    icon: 'heart-outline',
    color: '#1e3a8a',
  },
  {
    id: 'weight',
    title: 'Accelerate weight loss',
    icon: 'trending-down-outline',
    color: '#1e3a8a',
  },
  {
    id: 'sleep',
    title: 'Improve sleep quality',
    icon: 'moon-outline',
    color: '#1e3a8a',
  },
  {
    id: 'energy',
    title: 'Increase daily energy',
    icon: 'flash-outline',
    color: '#1e3a8a',
  },
  {
    id: 'money',
    title: 'Keep more money',
    icon: 'wallet-outline',
    color: '#1e3a8a',
  },
  {
    id: 'relationships',
    title: 'Strengthen connections',
    icon: 'people-outline',
    color: '#1e3a8a',
  },
  {
    id: 'productivity',
    title: 'Enhance focus and output',
    icon: 'rocket-outline',
    color: '#1e3a8a',
  },
  {
    id: 'mental',
    title: 'Achieve mental sharpness',
    icon: 'bulb-outline',
    color: '#1e3a8a',
  },
];

export default function ReasonsAndGoals() {
  const router = useRouter();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const handleNext = () => {
    if (selectedReasons.length > 0) {
      router.push('/onboarding/exercise-commitment');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const toggleReason = (id: string) => {
    setSelectedReasons(prev =>
      prev.includes(id)
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  const progress = 10 / 22; // 10th screen out of 22 total

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>What motivates your change?</Text>
        <Text style={styles.subtitle}>
          Choose any that resonate - these will guide your journey
        </Text>

        <View style={styles.optionsContainer}>
          {reasonsAndGoals.map((reason) => (
            <TouchableOpacity
              key={reason.id}
              style={[
                styles.option,
                selectedReasons.includes(reason.id) && styles.selectedOption,
              ]}
              onPress={() => toggleReason(reason.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: reason.color + '20' },
                    selectedReasons.includes(reason.id) && styles.selectedIconContainer,
                  ]}
                >
                  <Ionicons
                    name={reason.icon as any}
                    size={24}
                    color={selectedReasons.includes(reason.id) ? '#fff' : reason.color}
                  />
                </View>
                <Text
                  style={[
                    styles.optionTitle,
                    selectedReasons.includes(reason.id) && styles.selectedOptionTitle,
                  ]}
                >
                  {reason.title}
                </Text>
                <View style={[
                  styles.checkCircle,
                  selectedReasons.includes(reason.id) && styles.checkCircleActive,
                ]}>
                  {selectedReasons.includes(reason.id) && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {selectedReasons.length > 0 && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedInfoText}>
              {selectedReasons.length} motivation{selectedReasons.length > 1 ? 's' : ''} chosen
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedReasons.length === 0 && styles.disabledButton]}
          onPress={handleNext}
          disabled={selectedReasons.length === 0}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
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
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    backgroundColor: '#f0f4ff',
    borderColor: '#1e3a8a',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconContainer: {
    backgroundColor: '#1e3a8a',
  },
  optionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  selectedOptionTitle: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  selectedInfo: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedInfoText: {
    fontSize: 14,
    color: '#0369a1',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});