import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

export default function UnmatchedRoute() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log('Unmatched route accessed:', segments);
    
    // If it's a callback-related route, redirect to home
    const routeName = segments.join('/');
    if (routeName.includes('callback') || 
        routeName.includes('oauth') || 
        routeName.includes('auth') ||
        routeName.includes('native-intent')) {
      console.log('Redirecting callback route to home');
      router.replace('/');
    } else {
      // For other unmatched routes, also redirect to home
      console.log('Unknown route, redirecting to home');
      router.replace('/');
    }
  }, [segments]);

  return <View />;
}