import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs-disabled)" />
      <Stack.Screen name="test" />
      <Stack.Screen name="meditation" />
      <Stack.Screen name="breathing-exercise" />
      <Stack.Screen name="coping-strategies" />
      <Stack.Screen name="craving-diary" />
      <Stack.Screen name="craving-mode" />
    </Stack>
  );
}