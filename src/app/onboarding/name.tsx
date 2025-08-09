import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserProfile } from '@/hooks/use-user-profile';

export default function Name() {
  const router = useRouter();
  const [name, setName] = useState('');
  const { saveProfile } = useUserProfile();

  const handleContinue = async () => {
    if (name.trim()) {
      // Save name to Supabase/local storage
      await saveProfile({ name: name.trim() });
      router.push('/onboarding/gender');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4ff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>What should we call you?</Text>
          <Text style={styles.subtitle}>
            This helps us personalize your experience
          </Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#999999"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
        </View>
      </KeyboardAvoidingView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !name.trim() && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!name.trim()}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            !name.trim() && styles.continueButtonTextDisabled,
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a3a7b',
    marginTop: 20,
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressDot: {
    width: 26,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d0d0d0',
  },
  progressDotActive: {
    backgroundColor: '#1a3a7b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    lineHeight: 24,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1a1a1a',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  continueButtonTextDisabled: {
    color: '#999999',
  },
});