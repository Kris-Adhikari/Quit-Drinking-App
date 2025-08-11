import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TypicalWeek() {
  const router = useRouter();
  const [drinksPerWeek, setDrinksPerWeek] = useState(20);
  const [averageCost, setAverageCost] = useState(8);

  const monthlySpending = Math.round((drinksPerWeek * averageCost * 52) / 12);
  const yearlySpending = drinksPerWeek * averageCost * 52;

  const drinksSliderRef = useRef<View | null>(null);
  const costSliderRef = useRef<View | null>(null);

  const createSliderPanResponder = (
    setValue: React.Dispatch<React.SetStateAction<number>>,
    minValue: number,
    maxValue: number,
    sliderRef: React.RefObject<View | null>
  ) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (sliderRef.current) {
          sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            const touchX = evt.nativeEvent.pageX - pageX;
            const percentage = Math.max(0, Math.min(1, touchX / width));
            const newValue = Math.round(minValue + percentage * (maxValue - minValue));
            setValue(newValue);
          });
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (sliderRef.current) {
          sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            const touchX = evt.nativeEvent.pageX - pageX;
            const percentage = Math.max(0, Math.min(1, touchX / width));
            const newValue = Math.round(minValue + percentage * (maxValue - minValue));
            setValue(newValue);
          });
        }
      },
    });
  };

  const drinksPanResponder = createSliderPanResponder(setDrinksPerWeek, 0, 50, drinksSliderRef);
  const costPanResponder = createSliderPanResponder(setAverageCost, 3, 20, costSliderRef);

  const handleContinue = () => {
    router.push('/onboarding/types-of-alcohol');
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
          <View style={[styles.progressFill, { width: `${13 / 22 * 100}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Tell us about your drinking habits</Text>
        <View style={styles.momentumBox}>
          <Text style={styles.momentumText}>
            You're building something powerful - a clear path to your success.
          </Text>
        </View>

        <View style={styles.spendingSection}>
          <Text style={styles.spendingSectionTitle}>Your Alcohol Budget Impact</Text>
          <View style={styles.spendingRow}>
            <View style={styles.spendingColumn}>
              <Text style={styles.spendingLabel}>Monthly</Text>
              <Text style={styles.spendingAmount}>${monthlySpending}</Text>
            </View>
            <View style={styles.spendingColumn}>
              <Text style={styles.spendingLabel}>Yearly</Text>
              <Text style={styles.spendingAmount}>${yearlySpending.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sliderSection}>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Weekly{'\n'}Consumption</Text>
              <Text style={styles.sliderValue}>{drinksPerWeek}</Text>
            </View>
            <View 
              ref={drinksSliderRef}
              style={styles.sliderTrack} 
              {...drinksPanResponder.panHandlers}
            >
              <View style={styles.sliderBackground} />
              <View style={[styles.sliderProgress, { width: `${(drinksPerWeek / 50) * 100}%` }]} />
              <View style={[styles.sliderThumb, { left: `${(drinksPerWeek / 50) * 100}%` }]} />
            </View>
          </View>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Typical Expense{'\n'}(Per Drink)</Text>
              <Text style={styles.sliderValue}>${averageCost}</Text>
            </View>
            <View 
              ref={costSliderRef}
              style={styles.sliderTrack} 
              {...costPanResponder.panHandlers}
            >
              <View style={styles.sliderBackground} />
              <View style={[styles.sliderProgress, { width: `${((averageCost - 3) / 17) * 100}%` }]} />
              <View style={[styles.sliderThumb, { left: `${((averageCost - 3) / 17) * 100}%` }]} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
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
    paddingTop: 15,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
    lineHeight: 30,
  },
  momentumBox: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  momentumText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    fontWeight: '600',
  },
  spendingSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spendingSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
    textAlign: 'center',
  },
  spendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  spendingColumn: {
    alignItems: 'center',
  },
  spendingLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  spendingAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  sliderSection: {
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sliderValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  sliderTrack: {
    width: '100%',
    height: 40,
    backgroundColor: 'transparent',
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderBackground: {
    position: 'absolute',
    top: 17,
    width: '100%',
    height: 6,
    backgroundColor: '#e8e8e8',
    borderRadius: 3,
  },
  sliderProgress: {
    height: 6,
    backgroundColor: '#1e3a8a',
    borderRadius: 3,
    position: 'absolute',
    top: 17,
  },
  sliderThumb: {
    position: 'absolute',
    top: 10,
    marginLeft: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1e3a8a',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});