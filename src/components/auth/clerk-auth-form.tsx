import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useOAuth, useSignIn, useSignUp, useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export function ClerkAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const clerk = useClerk();
  
  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();
  
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: 'oauth_apple' });
  
  console.log('Clerk state:', { 
    clerkLoaded: clerk.loaded,
    signInLoaded,
    signUpLoaded,
    hasGoogleFlow: !!startGoogleFlow,
    hasAppleFlow: !!startAppleFlow
  });

  // Warm up the browser for OAuth
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        if (!signUp) throw new Error('Sign up not initialized');
        
        const result = await signUp.create({
          emailAddress: email,
          password,
        });

        if (result.status === 'complete') {
          await setActiveSignUp({ session: result.createdSessionId });
          router.replace('/');
        } else if (result.status === 'missing_requirements') {
          Alert.alert('Verification Required', 'Please check your email to verify your account.');
        }
      } else {
        if (!signIn) throw new Error('Sign in not initialized');
        
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === 'complete') {
          await setActiveSignIn({ session: result.createdSessionId });
          router.replace('/');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      Alert.alert(
        'Authentication Failed',
        err.errors?.[0]?.message || err.message || 'An error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (strategy: 'google' | 'apple') => {
    console.log(`Starting OAuth with ${strategy}...`);
    setIsLoading(true);
    try {
      const startFlow = strategy === 'google' ? startGoogleFlow : startAppleFlow;
      
      console.log('About to start OAuth flow...');
      // Start the OAuth flow
      const { createdSessionId, signIn, signUp, setActive } = await startFlow();
      console.log('OAuth flow completed!');
      console.log('OAuth response:', { 
        createdSessionId, 
        signInStatus: signIn?.status,
        signUpStatus: signUp?.status,
        hasSetActive: !!setActive 
      });
      
      // If we have a session, set it as active
      if (createdSessionId && setActive) {
        console.log('Setting active session:', createdSessionId);
        await setActive({ session: createdSessionId });
        console.log('Redirecting to main app...');
        router.replace('/');
      } else {
        // Create a session from the OAuth sign in/up
        if (signIn?.status === 'complete' && setActiveSignIn) {
          console.log('Setting active sign in session:', signIn.createdSessionId);
          await setActiveSignIn({ session: signIn.createdSessionId! });
          console.log('Redirecting to main app...');
          router.replace('/');
        } else if (signUp?.status === 'complete' && setActiveSignUp) {
          console.log('Setting active sign up session:', signUp.createdSessionId);
          await setActiveSignUp({ session: signUp.createdSessionId! });
          console.log('Redirecting to main app...');
          router.replace('/');
        }
      }
    } catch (err: any) {
      console.error('OAuth error - Full details:', err);
      console.error('Error type:', typeof err);
      console.error('Error message:', err?.message);
      console.error('Error errors:', err?.errors);
      console.error('Error stack:', err?.stack);
      
      // More specific error messages
      let errorMessage = 'Failed to authenticate';
      if (err.message?.includes('browser')) {
        errorMessage = 'Please install a browser to continue with OAuth';
      } else if (err.message?.includes('redirect')) {
        errorMessage = 'OAuth redirect issue. Please check your Clerk dashboard settings.';
      } else if (err.errors?.[0]?.message) {
        errorMessage = err.errors[0].message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      Alert.alert('Authentication Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Authentication Required',
      'You need to sign in to use the app. Would you like to continue as a guest with limited features?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue as Guest', 
          onPress: () => router.replace('/(tabs)'),
          style: 'destructive'
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Stoppr</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Create your account' : 'Sign in to continue'}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleEmailAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsSignUp(!isSignUp)}
            disabled={isLoading}
          >
            <Text style={styles.switchText}>
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={[styles.button, styles.socialButton]}
            onPress={() => handleOAuth('google')}
            disabled={isLoading}
          >
            <View style={styles.socialButtonContent}>
              <Image 
                source={require('../../../assets/images/Google__G__logo.svg.png')} 
                style={styles.googleIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.button, styles.socialButton, styles.appleButton]}
              onPress={() => handleOAuth('apple')}
              disabled={isLoading}
            >
              <View style={styles.socialButtonContent}>
                <Image 
                  source={require('../../../assets/images/apple.png')} 
                  style={styles.appleIcon}
                  resizeMode="contain"
                />
                <Text style={[styles.socialButtonText, styles.appleButtonText]}>
                  Continue with Apple
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={isLoading}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 14,
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    paddingHorizontal: 10,
    color: '#999',
    fontSize: 14,
  },
  socialButtons: {
    marginBottom: 20,
  },
  socialButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  socialButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  appleButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  appleButtonText: {
    color: '#fff',
  },
  skipButton: {
    alignItems: 'center',
    padding: 12,
  },
  skipText: {
    color: '#999',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  appleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});