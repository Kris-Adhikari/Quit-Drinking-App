import { Redirect } from 'expo-router';

export default function Index() {
  // Start with sign-in/sign-up screen
  return <Redirect href="/auth/sign-in" />;
}