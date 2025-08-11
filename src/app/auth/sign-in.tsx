import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');

export default function SignIn() {
  const router = useRouter();
  const { session } = useAuth();
  const { profile } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: 'oauth_apple' });

  // Redirect to home if already signed in (let root index.tsx handle routing)
  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [session]);

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    try {
      setLoading(true);
      console.log(`Starting ${provider} OAuth with Clerk...`);
      
      const startFlow = provider === 'google' ? startGoogleFlow : startAppleFlow;
      const { createdSessionId, signIn, signUp, setActive } = await startFlow();
      console.log('OAuth flow completed:', { createdSessionId, signIn: !!signIn, signUp: !!signUp });
      
      if (createdSessionId && setActive) {
        console.log('Setting active session:', createdSessionId);
        await setActive({ session: createdSessionId });
        console.log('Session set successfully, redirecting...');
        router.replace('/');
      } else {
        console.log('No session created or setActive not available');
        Alert.alert('Authentication Error', 'Failed to create session');
      }
    } catch (error: any) {
      console.error('OAuth sign in error:', error);
      
      let errorMessage = 'An unexpected error occurred';
      if (error.message?.includes('browser')) {
        errorMessage = 'Please install a browser to continue with OAuth';
      } else if (error.message?.includes('redirect')) {
        errorMessage = 'OAuth redirect issue. Please check your Clerk dashboard settings.';
      } else if (error.errors?.[0]?.message) {
        errorMessage = error.errors[0].message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Sign In Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Navigate to value props without authentication
    router.replace('/onboarding/value-prop-1');
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert(
        'Reset Complete', 
        'All local data cleared. The app will now reload.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Force reload the app by navigating to the same screen
              // This will reset all React state
              router.replace('/auth/sign-in');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4ff" />
      
      <View style={styles.content}>
        {/* Logo/Brand Section */}
        <View style={styles.brandSection}>
          <Image 
            source={require('../../../assets/images/app.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Main Content */}
        <View style={styles.mainSection}>
          <Text style={styles.title}>Get the most from Sober Up</Text>
          <Text style={styles.subtitle}>
            Sign up to backup your progress,{'\n'}
            sync with other devices, and more.
          </Text>

          {/* Google Sign In Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => handleOAuthSignIn('google')}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Image 
              source={require('../../../assets/images/Google__G__logo.svg.png')} 
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Sign up with Google</Text>
          </TouchableOpacity>

          {/* Apple Sign In Button */}
          <TouchableOpacity
            style={styles.appleButton}
            onPress={() => handleOAuthSignIn('apple')}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Image 
              source={require('../../../assets/images/apple.png')} 
              style={styles.appleIcon}
              resizeMode="contain"
            />
            <Text style={styles.appleButtonText}>Sign up with Apple</Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Continue without signing up</Text>
          </TouchableOpacity>

          {/* Terms Text */}
          <Text style={styles.termsText}>
            By creating an account you agree{'\n'}
            to the Terms of Service
          </Text>

          {/* Temporary Reset Button for Testing */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={clearAllData}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>RESET ALL DATA (TEST)</Text>
          </TouchableOpacity>

          {/* Temporary Skip to Main Button for Testing */}
          <TouchableOpacity
            style={styles.skipToMainButton}
            onPress={() => router.replace('/(tabs)/daily')}
            activeOpacity={0.7}
          >
            <Text style={styles.skipToMainButtonText}>SKIP TO MAIN (TEST)</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#1e3a8a" />
          </View>
        )}
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
    paddingHorizontal: 24,
  },
  brandSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  logo: {
    width: 250,
    height: 250,
  },
  mainSection: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 100,
    width: width - 48,
    maxWidth: 320,
    marginBottom: 16,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    marginRight: 36, // Balance the icon space
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 100,
    width: width - 48,
    maxWidth: 320,
    marginBottom: 16,
  },
  appleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    marginRight: 36, // Balance the icon space
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4169e1',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 100,
    width: width - 48,
    maxWidth: 320,
    marginBottom: 16,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  termsText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  resetButton: {
    marginTop: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ff4444',
    borderRadius: 4,
  },
  resetButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  skipToMainButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4169e1',
    borderRadius: 4,
  },
  skipToMainButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(240, 244, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});