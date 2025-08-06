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

export default function RelateStatement2() {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    // Navigate immediately for better responsiveness
    router.push('/onboarding/relate-statement-3');
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
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Do you relate to the statement below?</Text>

        <View style={styles.statementContainer}>
          <Text style={styles.statement}>
            I often require external motivation to stick to my plan. I can easily give up when I feel stressed.
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
    width: 24,
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
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#1a3a7b',
  },
  noButtonSelected: {
    backgroundColor: '#e8e8e8',
  },
  noButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a3a7b',
  },
  noButtonTextSelected: {
    color: '#666666',
  },
  yesButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: '#1a3a7b',
  },
  yesButtonSelected: {
    backgroundColor: '#0d2755',
  },
  yesButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});