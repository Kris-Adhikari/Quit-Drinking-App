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
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${1 / 22 * 100}%` }]} />
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.topSection}>
          <Image 
            source={require('../../../assets/images/app.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.welcomeText}>Welcome to Sober Up</Text>
          
          <Text style={styles.subtitleText}>
            Let's discover how alcohol{'\n'}
            affects your wellness and{'\n'}
            create your path forward
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
          
          <View style={styles.socialProofContainer}>
            <Text style={styles.socialProofText}>
              "I lost 12 lbs in 6 weeks just by cutting alcohol and following the plan!" 
              <Text style={styles.socialProofAuthor}> - Taylor M.</Text>
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>10,000+</Text>
                <Text style={styles.statLabel}>People transformed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4.8★</Text>
                <Text style={styles.statLabel}>App rating</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={handleStartQuiz}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Begin Assessment</Text>
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
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 100,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1e3a8a',
    borderRadius: 2,
  },
  socialProofContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  socialProofText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    lineHeight: 22,
  },
  socialProofAuthor: {
    fontWeight: '600',
    color: '#1e3a8a',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
});