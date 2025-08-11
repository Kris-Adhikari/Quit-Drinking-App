import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AlcoholImpactOnGoals() {
  const router = useRouter();
  const [optInCalories, setOptInCalories] = useState(false);

  const handleNext = () => {
    router.push('/onboarding/relationship-alcohol');
  };

  const handleBack = () => {
    router.back();
  };

  const progress = 8 / 22; // 8th screen out of 22 total

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
        <Text style={styles.title}>Here's something interesting...</Text>
        
        <View style={styles.factCard}>
          <View style={styles.factHeader}>
            <Ionicons name="beer-outline" size={32} color="#1e3a8a" />
            <Text style={styles.equals}>=</Text>
            <Ionicons name="pizza-outline" size={32} color="#1e3a8a" />
          </View>
          
          <Text style={styles.factTitle}>Each alcoholic beverage = 140 calories</Text>
          <Text style={styles.factDescription}>
            The same as eating pizza or jogging for half an hour
          </Text>

          <View style={styles.comparisonContainer}>
            <View style={styles.comparisonItem}>
              <Text style={styles.drinkCount}>3 beverages</Text>
              <Text style={styles.comparisonText}>= 420 calories</Text>
              <Text style={styles.comparisonDetail}>Complete dinner</Text>
            </View>
            <View style={styles.comparisonItem}>
              <Text style={styles.drinkCount}>5 beverages</Text>
              <Text style={styles.comparisonText}>= 700 calories</Text>
              <Text style={styles.comparisonDetail}>120-min workout</Text>
            </View>
          </View>
        </View>

        <View style={styles.optInContainer}>
          <TouchableOpacity
            style={[styles.optInButton, optInCalories && styles.optInButtonActive]}
            onPress={() => setOptInCalories(!optInCalories)}
            activeOpacity={0.7}
          >
            <View style={styles.optInContent}>
              <View style={[styles.checkbox, optInCalories && styles.checkboxActive]}>
                {optInCalories && <Ionicons name="checkmark" size={18} color="#fff" />}
              </View>
              <View style={styles.optInTextContainer}>
                <Text style={styles.optInTitle}>Monitor calorie reduction</Text>
                <Text style={styles.optInDescription}>
                  Watch how avoiding alcohol benefits your body goals
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Reducing intake will help you:</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="flame-outline" size={20} color="#1e3a8a" />
              <Text style={styles.benefitText}>Process fat burning more effectively</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="battery-charging-outline" size={20} color="#1e3a8a" />
              <Text style={styles.benefitText}>Feel more energized during exercise</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="moon-outline" size={20} color="#1e3a8a" />
              <Text style={styles.benefitText}>Rest more deeply for muscle repair</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Understood!</Text>
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
    marginBottom: 24,
  },
  factCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  equals: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  factTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  factDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  comparisonContainer: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
  },
  comparisonItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  drinkCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  comparisonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  comparisonDetail: {
    fontSize: 12,
    color: '#666',
  },
  optInContainer: {
    marginTop: 24,
  },
  optInButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  optInButtonActive: {
    borderColor: '#1e3a8a',
    backgroundColor: '#f0f4ff',
  },
  optInContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  optInTextContainer: {
    flex: 1,
  },
  optInTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  optInDescription: {
    fontSize: 14,
    color: '#666',
  },
  benefitsContainer: {
    marginTop: 32,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 15,
    color: '#666',
    flex: 1,
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
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});