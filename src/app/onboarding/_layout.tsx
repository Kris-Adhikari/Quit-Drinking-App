import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="personalization-intro" />
      <Stack.Screen name="drinking-habits" />
      <Stack.Screen name="triggers" />
      <Stack.Screen name="goals" />
    </Stack>
  );
}