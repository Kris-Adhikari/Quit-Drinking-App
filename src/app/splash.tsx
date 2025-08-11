import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Splash() {
  const router = useRouter();

  const handleContinue = () => {
    router.replace('/auth/sign-in');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/app.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.congratulationsText}>Congratulations!</Text>
          <Text style={styles.tagline}>You're on your way to a healthier lifestyle</Text>
        </View>

        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="chevron-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 40,
  },
  congratulationsText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    minWidth: 200,
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
});