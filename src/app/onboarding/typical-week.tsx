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
  const [averageCost, setAverageCost] = useState(30);

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
  const costPanResponder = createSliderPanResponder(setAverageCost, 10, 200, costSliderRef);

  const handleContinue = () => {
    router.push('/onboarding/types-of-alcohol');
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
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What does your typical week look like for you?</Text>

        <View style={styles.spendingSection}>
          <Text style={styles.spendingSectionTitle}>Your Total Spending on Alcohol</Text>
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
              <Text style={styles.sliderLabel}>Drinks{'\n'}(Per Week)</Text>
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
              <Text style={styles.sliderLabel}>Average Cost{'\n'}(Per Week)</Text>
              <Text style={styles.sliderValue}>${averageCost}</Text>
            </View>
            <View 
              ref={costSliderRef}
              style={styles.sliderTrack} 
              {...costPanResponder.panHandlers}
            >
              <View style={styles.sliderBackground} />
              <View style={[styles.sliderProgress, { width: `${((averageCost - 10) / 190) * 100}%` }]} />
              <View style={[styles.sliderThumb, { left: `${((averageCost - 10) / 190) * 100}%` }]} />
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 40,
    lineHeight: 36,
  },
  spendingSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
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
    marginBottom: 40,
  },
  sliderContainer: {
    marginBottom: 30,
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
    backgroundColor: '#1a3a7b',
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
    backgroundColor: '#1a3a7b',
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
    marginTop: 'auto',
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: '#1a3a7b',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});