import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="value-prop-1" />
      <Stack.Screen name="value-prop-2" />
      <Stack.Screen name="value-prop-3" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="personalization-intro" />
      <Stack.Screen name="name" />
      <Stack.Screen name="gender" />
      <Stack.Screen name="age" />

      {/* NEW fitness + weight loss intro screens */}
      <Stack.Screen name="current-fitness-level" />
      <Stack.Screen name="weight-goal" />
      <Stack.Screen name="alcohol-impact-on-goals" />

      {/* Keep alcohol-related questions but in new order */}
      <Stack.Screen name="relationship-alcohol" />
      <Stack.Screen name="reasons-and-goals" />
      <Stack.Screen name="exercise-commitment" />
      <Stack.Screen name="triggers" />
      <Stack.Screen name="typical-week" />
      <Stack.Screen name="types-of-alcohol" />
      <Stack.Screen name="previous-attempts" />
      <Stack.Screen name="regret" />

      {/* Keep behavioral depth but can merge to reduce friction */}
      <Stack.Screen name="drinking-habits" />
      <Stack.Screen name="interference-frequency" />
      <Stack.Screen name="relate-statement" />
      <Stack.Screen name="relate-statement-2" />
      <Stack.Screen name="relate-statement-3" />

      {/* Plan outline and final setup screens */}
      <Stack.Screen name="plan-outline" />
      <Stack.Screen name="first-goal-setup" />
    </Stack>
  );
}