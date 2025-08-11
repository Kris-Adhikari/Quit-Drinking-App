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

export default function RelateStatement3() {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    // Navigate immediately for better responsiveness
    router.push('/onboarding/plan-outline');
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
          <View style={[styles.progressFill, { width: `${21.8 / 22 * 100}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Does this statement resonate with you?</Text>

        <View style={styles.statementContainer}>
          <Text style={styles.statement}>
            I make commitments to myself about reducing consumption, but then I don't follow through.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.noButton,
              selectedAnswer === 'no' && styles.noButtonSelected
            ]}
            onPress={() => handleAnswer('no')}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.noButtonText,
              selectedAnswer === 'no' && styles.noButtonTextSelected
            ]}>
              No
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.yesButton,
              selectedAnswer === 'yes' && styles.yesButtonSelected
            ]}
            onPress={() => handleAnswer('yes')}
            activeOpacity={0.8}
          >
            <Text style={styles.yesButtonText}>
              Yes
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
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 36,
  },
  statementContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 100,
  },
  statement: {
    fontSize: 24,
    fontWeight: '500',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 36,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 30,
    alignItems: 'center',
  },
  noButton: {
    width: 120,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#1e3a8a',
  },
  noButtonSelected: {
    backgroundColor: '#e8e8e8',
  },
  noButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  noButtonTextSelected: {
    color: '#666666',
  },
  yesButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#1e3a8a',
  },
  yesButtonSelected: {
    backgroundColor: '#1a3a8a',
  },
  yesButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});