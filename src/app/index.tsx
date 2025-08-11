import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';

export default function Index() {
  const { user, isSignedIn, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [isReady, setIsReady] = useState(false);
  
  console.log('Index - Auth state:', { 
    isSignedIn, 
    userId: user?.id, 
    authLoading,
    profileLoading,
    isReady,
    profileExists: !!profile,
    onboardingCompleted: profile?.onboarding_completed 
  });

  useEffect(() => {
    // Only set ready when auth is loaded
    if (!authLoading) {
      // For signed in users, wait for profile loading too
      if (isSignedIn && profileLoading) {
        return; // Keep waiting
      }
      
      // Small delay to prevent flash
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [authLoading, profileLoading, isSignedIn]);

  // Show loading while not ready
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  // Not signed in - go to splash
  if (!isSignedIn) {
    return <Redirect href="/splash" />;
  }

  // Signed in and onboarding completed - go to main app
  if (profile?.onboarding_completed === true) {
    return <Redirect href="/(tabs)/daily" />;
  }

  // Signed in but needs onboarding (skip splash/value props)
  return <Redirect href="/onboarding/welcome" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fb',
  },
});