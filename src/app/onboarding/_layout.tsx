import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="personalization-intro" />
      <Stack.Screen name="location" />
      <Stack.Screen name="name" />
      <Stack.Screen name="gender" />
      <Stack.Screen name="age" />
      <Stack.Screen name="welcome-profile" />
      <Stack.Screen name="relationship" />
      <Stack.Screen name="exercise-preview" />
      <Stack.Screen name="reasons" />
      <Stack.Screen name="relationship-alcohol" />
      <Stack.Screen name="previous-attempts" />
      <Stack.Screen name="regret" />
      <Stack.Screen name="typical-week" />
      <Stack.Screen name="types-of-alcohol" />
      <Stack.Screen name="reasons-for-drinking" />
      <Stack.Screen name="interference-frequency" />
      <Stack.Screen name="relate-statement" />
      <Stack.Screen name="relate-statement-2" />
      <Stack.Screen name="relate-statement-3" />
      <Stack.Screen name="drinking-habits" />
      <Stack.Screen name="triggers" />
      <Stack.Screen name="goals" />
    </Stack>
  );
}