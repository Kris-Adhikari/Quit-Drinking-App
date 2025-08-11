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

const drinkingTriggers = [
  { id: 'stress', title: 'Tension & Worry', description: 'Job stress, life pressures, anxious feelings', icon: 'alert-circle-outline' },
  { id: 'social', title: 'Group Activities', description: 'Gatherings, meals out, social occasions', icon: 'people-outline' },
  { id: 'boredom', title: 'Idle Time', description: 'Having nothing planned, restless feelings', icon: 'time-outline' },
  { id: 'emotions', title: 'Challenging Feelings', description: 'Upset, irritation, disappointment', icon: 'heart-outline' },
  { id: 'habit', title: 'Regular Patterns', description: 'End of workday, during meals, TV time', icon: 'refresh-outline' },
  { id: 'celebration', title: 'Special Occasions', description: 'Milestones, positive news, weekend rituals', icon: 'trophy-outline' },
  { id: 'other', title: 'Different Reason', description: 'A trigger not mentioned here', icon: 'ellipsis-horizontal-outline' },
];

export default function Triggers() {
  const router = useRouter();
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  const handleToggleTrigger = (triggerId: string) => {
    setSelectedTriggers(prev => {
      if (prev.includes(triggerId)) {
        return prev.filter(id => id !== triggerId);
      }
      return [...prev, triggerId];
    });
  };

  const handleContinue = () => {
    if (selectedTriggers.length > 0) {
      router.push('/onboarding/typical-week');
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
          <View style={[styles.progressFill, { width: `${12 / 22 * 100}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.topSection}>
          <Text style={styles.title}>Let's identify your triggers so you can master them</Text>
          <Text style={styles.empowerment}>
            Self-awareness is your superpower. Recognizing these patterns puts you ahead of most people.
          </Text>
          <Text style={styles.subtitle}>
            Choose the circumstances that usually result in alcohol consumption
          </Text>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.optionsContainer}>
          {drinkingTriggers.map((trigger) => (
            <TouchableOpacity
              key={trigger.id}
              style={[
                styles.option,
                selectedTriggers.includes(trigger.id) && styles.selectedOption,
              ]}
              onPress={() => handleToggleTrigger(trigger.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Ionicons
                  name={trigger.icon as any}
                  size={32}
                  color={selectedTriggers.includes(trigger.id) ? '#fff' : '#1e3a8a'}
                />
                <View style={styles.optionText}>
                  <Text
                    style={[
                      styles.optionTitle,
                      selectedTriggers.includes(trigger.id) && styles.selectedOptionTitle,
                    ]}
                  >
                    {trigger.title}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      selectedTriggers.includes(trigger.id) && styles.selectedOptionDescription,
                    ]}
                  >
                    {trigger.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedTriggers.length === 0 && styles.disabledButton]}
          onPress={handleContinue}
          disabled={selectedTriggers.length === 0}
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  topSection: {
    paddingBottom: 20,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  empowerment: {
    fontSize: 16,
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
    backgroundColor: '#f0f4ff',
    padding: 12,
    borderRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 16,
  },
  option: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  selectedOptionTitle: {
    color: '#fff',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
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