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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';
import { supabase } from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');

export default function SignIn() {
  const router = useRouter();
  const { signInWithOAuth, session } = useAuth();
  const { profile } = useUserProfile();
  const [loading, setLoading] = useState(false);

  // Redirect to home if already signed in (let root index.tsx handle routing)
  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [session]);

  const handleOAuthSignIn = async (provider: 'google') => {
    try {
      setLoading(true);
      
      // Get the redirect URI first
      // Use stoppr:// scheme to match Supabase config
      const redirectUri = makeRedirectUri({
        scheme: 'stoppr',
      });
      console.log('Redirect URI:', redirectUri);
      
      // Pass redirect URI to the auth hook
      const { data, error } = await signInWithOAuth(provider, redirectUri);
      
      if (error) {
        Alert.alert('Sign In Failed', error.message);
        return;
      }

      if (data?.url) {
        console.log('OAuth URL:', data.url);
        
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri
        );

        console.log('OAuth result:', result);
        
        if (result.type === 'success') {
          // Parse the URL to get the auth tokens
          const url = result.url;
          console.log('Success URL:', url);
          
          // Extract access_token and refresh_token from URL
          const urlParams = new URLSearchParams(url.split('#')[1] || url.split('?')[1]);
          const accessToken = urlParams.get('access_token');
          const refreshToken = urlParams.get('refresh_token');
          
          if (accessToken) {
            // Set the session manually
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            
            if (sessionError) {
              console.error('Session error:', sessionError);
              Alert.alert('Authentication Error', 'Failed to establish session');
            } else {
              console.log('Session established successfully');
            }
          } else {
            Alert.alert('Authentication Error', 'No access token received');
          }
        } else if (result.type === 'cancel') {
          console.log('OAuth cancelled by user');
        } else if (result.type === 'dismiss') {
          console.log('OAuth dismissed by user');
        }
      } else {
        Alert.alert('Authentication Error', 'No OAuth URL received');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('OAuth sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Navigate to onboarding without authentication
    router.replace('/onboarding/welcome');
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
            <View style={styles.googleIconContainer}>
              <Ionicons name="logo-google" size={20} color="#fff" />
            </View>
            <Text style={styles.googleButtonText}>Sign up with Google</Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
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
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
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
  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textDecorationLine: 'underline',
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