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

export default function ExerciseCommitment() {
  const router = useRouter();
  const [commitment, setCommitment] = useState<boolean | null>(null);

  const handleNext = () => {
    if (commitment !== null) {
      router.push('/onboarding/triggers');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const progress = 11 / 22; // 11th screen out of 22 total

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
        <Text style={styles.title}>Interested in fitness recommendations?</Text>
        <Text style={styles.subtitle}>
          We can provide brief exercise ideas to accelerate your progress
        </Text>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="time-outline" size={20} color="#1e3a8a" />
            </View>
            <Text style={styles.benefitText}>Quick 5-15 minute sessions</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="home-outline" size={20} color="#1e3a8a" />
            </View>
            <Text style={styles.benefitText}>Equipment-free routines</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="flash-outline" size={20} color="#1e3a8a" />
            </View>
            <Text style={styles.benefitText}>Enhanced metabolism with reduced drinking</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.option,
              commitment === true && styles.selectedOption,
            ]}
            onPress={() => setCommitment(true)}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.optionIcon,
                { backgroundColor: '#1e3a8a20' },
                commitment === true && styles.selectedOptionIcon,
              ]}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={32}
                  color={commitment === true ? '#fff' : '#1e3a8a'}
                />
              </View>
              <View style={styles.optionText}>
                <Text
                  style={[
                    styles.optionTitle,
                    commitment === true && styles.selectedOptionTitle,
                  ]}
                >
                  Absolutely, sign me up!
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    commitment === true && styles.selectedOptionDescription,
                  ]}
                >
                  Receive tailored fitness recommendations
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              commitment === false && styles.selectedOption,
            ]}
            onPress={() => setCommitment(false)}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.optionIcon,
                { backgroundColor: '#1e3a8a20' },
                commitment === false && styles.selectedOptionIcon,
              ]}>
                <Ionicons
                  name="close-circle-outline"
                  size={32}
                  color={commitment === false ? '#fff' : '#1e3a8a'}
                />
              </View>
              <View style={styles.optionText}>
                <Text
                  style={[
                    styles.optionTitle,
                    commitment === false && styles.selectedOptionTitle,
                  ]}
                >
                  Skip for now
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    commitment === false && styles.selectedOptionDescription,
                  ]}
                >
                  Concentrate solely on drinking habits
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            This preference can be updated anytime in your settings
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, commitment === null && styles.disabledButton]}
          onPress={handleNext}
          disabled={commitment === null}
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
  benefitsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 15,
    color: '#1a1a1a',
    flex: 1,
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
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOptionIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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