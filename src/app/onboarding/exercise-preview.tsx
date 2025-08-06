import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const exercises = [
  {
    id: 'assessment',
    title: 'Assessment To Track Progress',
    duration: '5 min assessment',
    emoji: '📊',
  },
  {
    id: 'breathing',
    title: 'Three Minute Breathing',
    duration: '3 min exercise',
    emoji: '🫁',
  },
  {
    id: 'thrive',
    title: 'Thrive Tip: I Feel Left Out When I Don\'t Drink',
    duration: '2 min read',
    emoji: '💡',
  },
  {
    id: 'dopamine',
    title: 'Alcohol, Dopamine & the Hedonic Setpoint',
    duration: '5 min read',
    emoji: '🧠',
  },
];

export default function ExercisePreview() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/onboarding/reasons');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3c5aa6" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerSubtitle}>Neuroscience-Based Program</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          Sticking to a plan is hard.{'\n'}
          Our bite-sized daily{'\n'}
          exercises make it easier.
        </Text>

        <View style={styles.exerciseList}>
          {exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.iconContainer}>
                <Text style={styles.exerciseEmoji}>{exercise.emoji}</Text>
              </View>
              <View style={styles.exerciseContent}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-forward" size={24} color="#3c5aa6" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c5aa6',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffd700',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 30,
    lineHeight: 40,
  },
  exerciseList: {
    marginTop: 20,
  },
  exerciseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f8f9ff',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseEmoji: {
    fontSize: 24,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  exerciseDuration: {
    fontSize: 14,
    color: '#666666',
  },
  bottomContainer: {
    padding: 20,
    alignItems: 'center',
  },
  continueButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
});