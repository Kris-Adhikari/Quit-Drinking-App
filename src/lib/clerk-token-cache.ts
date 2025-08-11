import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const createTokenCache = () => {
  return {
    async getToken(key: string) {
      try {
        const item = await SecureStore.getItemAsync(key);
        console.log(`SecureStore: Getting token for key: ${key}, value: ${item ? 'exists' : 'null'}`);
        return item;
      } catch (error) {
        console.error('SecureStore get error:', error);
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        console.log(`SecureStore: Saving token for key: ${key}`);
        return await SecureStore.setItemAsync(key, value);
      } catch (error) {
        console.error('SecureStore save error:', error);
      }
    },
    async deleteToken(key: string) {
      try {
        console.log(`SecureStore: Deleting token for key: ${key}`);
        return await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.error('SecureStore delete error:', error);
      }
    },
  };
};

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined;