import { Stack } from 'expo-router';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@/lib/clerk-token-cache';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  if (!publishableKey) {
    console.log('Warning: EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set. Using app without authentication.');
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="oauth-native-callback" />
        <Stack.Screen name="clerk-callback" />
        <Stack.Screen name="+native-intent" />
        <Stack.Screen name="test" />
        <Stack.Screen name="meditation" />
        <Stack.Screen name="breathing-exercise" />
        <Stack.Screen name="coping-strategies" />
        <Stack.Screen name="craving-diary" />
        <Stack.Screen name="craving-mode" />
        <Stack.Screen name="daily-quote" />
        <Stack.Screen name="neuroplasticity-article" />
      </Stack>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="splash" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="oauth-native-callback" />
          <Stack.Screen name="clerk-callback" />
          <Stack.Screen name="+native-intent" />
          <Stack.Screen name="test" />
          <Stack.Screen name="meditation" />
          <Stack.Screen name="breathing-exercise" />
          <Stack.Screen name="coping-strategies" />
          <Stack.Screen name="craving-diary" />
          <Stack.Screen name="craving-mode" />
          <Stack.Screen name="daily-quote" />
          <Stack.Screen name="neuroplasticity-article" />
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}