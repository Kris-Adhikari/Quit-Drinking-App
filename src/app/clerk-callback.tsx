import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function ClerkCallback() {
  const router = useRouter();

  useEffect(() => {
    // Clerk handles the OAuth callback internally
    // Just redirect to the main app
    router.replace('/');
  }, []);

  // Show nothing during the callback processing
  return <View />;
}