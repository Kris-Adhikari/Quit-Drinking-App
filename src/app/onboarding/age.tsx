import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');
const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 3;

export default function Age() {
  const router = useRouter();
  const [selectedAge, setSelectedAge] = useState(30);
  const scrollViewRef = useRef<ScrollView>(null);

  // Generate age options from 18 to 100
  const ages = Array.from({ length: 83 }, (_, i) => i + 18);

  const handleContinue = () => {
    router.push('/onboarding/current-fitness-level');
  };

  const handleBack = () => {
    router.back();
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const age = ages[Math.max(0, Math.min(index, ages.length - 1))];
    if (age !== selectedAge) {
      setSelectedAge(age);
    }
  };

  const scrollToAge = (age: number) => {
    const index = ages.indexOf(age);
    if (index !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: true,
      });
    }
  };

  React.useEffect(() => {
    // Center the initial age
    setTimeout(() => {
      scrollToAge(30);
    }, 100);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${5 / 22 * 100}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How old are you?</Text>
        <Text style={styles.subtitle}>
          Age helps us tailor your wellness approach.
        </Text>

        <View style={styles.pickerContainer}>
          <View style={styles.selectionIndicator} />
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate={0.9}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
            }}
            style={styles.scrollView}
          >
            {ages.map((age) => (
              <TouchableOpacity
                key={age}
                style={styles.ageItem}
                onPress={() => scrollToAge(age)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.ageText,
                  selectedAge === age && styles.selectedAgeText,
                  Math.abs(selectedAge - age) === 1 && styles.nearAgeText,
                  Math.abs(selectedAge - age) > 1 && styles.distantAgeText,
                ]}>
                  {age}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    lineHeight: 24,
  },
  pickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    marginVertical: 40,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#d0d0d0',
    pointerEvents: 'none',
    zIndex: 1,
  },
  ageItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageText: {
    fontSize: 24,
    color: '#999999',
    fontWeight: '400',
    transition: 'all 0.1s ease',
  },
  selectedAgeText: {
    fontSize: 32,
    color: '#1a1a1a',
    fontWeight: '700',
  },
  nearAgeText: {
    fontSize: 26,
    color: '#666666',
    fontWeight: '500',
  },
  distantAgeText: {
    fontSize: 20,
    opacity: 0.4,
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
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});