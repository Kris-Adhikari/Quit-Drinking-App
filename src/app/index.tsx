import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';

export default function Index() {
  const { session } = useAuth();
  const { profile, loading } = useUserProfile();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Give a moment for everything to initialize
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner while checking auth state
  if (!isReady || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  // If user is signed in and has completed onboarding, go to main app
  if (session && profile?.onboarding_completed) {
    return <Redirect href="/(tabs)/daily" />;
  }

  // If user is signed in but hasn't completed onboarding AND profile exists but explicitly set to false, go to onboarding
  if (session && profile && profile.onboarding_completed === false) {
    return <Redirect href="/onboarding/welcome" />;
  }

  // If user is signed in but profile doesn't exist yet or onboarding_completed is null/undefined, go to main app
  // This handles the case where existing users haven't had onboarding_completed set yet
  if (session) {
    return <Redirect href="/(tabs)/daily" />;
  }

  // Otherwise, go to sign-in page
  return <Redirect href="/auth/sign-in" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fb',
  },
});