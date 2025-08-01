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

const triggerOptions = [
  { id: 'stress', label: 'Stress', icon: 'alert-circle' },
  { id: 'social', label: 'Social Pressure', icon: 'people' },
  { id: 'boredom', label: 'Boredom', icon: 'time' },
  { id: 'celebration', label: 'Celebrations', icon: 'happy' },
  { id: 'anxiety', label: 'Anxiety', icon: 'pulse' },
  { id: 'routine', label: 'Daily Routine', icon: 'refresh' },
  { id: 'loneliness', label: 'Loneliness', icon: 'person' },
  { id: 'anger', label: 'Anger', icon: 'flame' },
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
      router.push('/onboarding/goals');
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
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What triggers your drinking?</Text>
        <Text style={styles.subtitle}>
          Select all that apply. This helps us provide better support.
        </Text>

        <View style={styles.triggersGrid}>
          {triggerOptions.map((trigger) => (
            <TouchableOpacity
              key={trigger.id}
              style={[
                styles.triggerCard,
                selectedTriggers.includes(trigger.id) && styles.triggerCardSelected,
              ]}
              onPress={() => handleToggleTrigger(trigger.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={trigger.icon as any}
                size={28}
                color={selectedTriggers.includes(trigger.id) ? '#8B5CF6' : '#666666'}
              />
              <Text style={[
                styles.triggerLabel,
                selectedTriggers.includes(trigger.id) && styles.triggerLabelSelected,
              ]}>
                {trigger.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedTriggers.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedTriggers.length === 0}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            selectedTriggers.length === 0 && styles.continueButtonTextDisabled,
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
    lineHeight: 22,
  },
  triggersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  triggerCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  triggerCardSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#f8f5ff',
  },
  triggerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginTop: 12,
    textAlign: 'center',
  },
  triggerLabelSelected: {
    color: '#8B5CF6',
  },
  continueButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
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