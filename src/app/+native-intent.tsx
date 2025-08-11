import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function NativeIntent() {
  const router = useRouter();

  useEffect(() => {
    // Handle native intent callback
    router.replace('/');
  }, []);

  return <View />;
}