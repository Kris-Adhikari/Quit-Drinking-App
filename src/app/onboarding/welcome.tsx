import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/use-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleStartQuiz = () => {
    router.push('/onboarding/personalization-intro');
  };

  const handleReset = async () => {
    try {
      await signOut();
      await AsyncStorage.clear();
      Alert.alert(
        'Reset Complete', 
        'All data cleared and signed out. Redirecting to sign-in.',
        [{ text: 'OK', onPress: () => router.replace('/auth/sign-in') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reset. Try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4ff" />
      
      <View style={styles.content}>
        <View style={styles.topSection}>
          <Image 
            source={require('../../../assets/images/app.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.welcomeText}>Welcome to Sober Up</Text>
          
          <Text style={styles.subtitleText}>
            Let's start by finding out if{'\n'}
            you have a problem with{'\n'}
            alcohol
          </Text>
          
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name="star"
                size={24}
                color="#FFD700"
                style={styles.star}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={handleStartQuiz}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Quiz</Text>
            <Ionicons name="chevron-forward" size={20} color="#ffffff" />
          </TouchableOpacity>

          {/* Temporary Reset Button */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>RESET ALL DATA & SIGN OUT</Text>
          </TouchableOpacity>
          
          <View style={styles.indicator}>
            <View style={styles.indicatorLine} />
          </View>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  subtitleText: {
    fontSize: 18,
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 30,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  star: {
    marginHorizontal: 2,
  },
  bottomContainer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4169e1',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
    minWidth: 200,
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  indicator: {
    width: 100,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  indicatorLine: {
    width: '20%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
  },
});