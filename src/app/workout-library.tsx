import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { workoutLibrary, type Workout } from '@/lib/workout-content';

export default function WorkoutLibrary() {
  const router = useRouter();
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  const toggleWorkoutExpansion = (workoutId: string) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fb" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Library</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Exercise for Recovery & Weight Loss</Text>
          <Text style={styles.introDescription}>
            Exercise is one of the most effective tools for managing cravings and accelerating weight loss. Physical activity releases endorphins that naturally reduce stress and improve mood, making it easier to stay committed to your goals.
          </Text>
        </View>

        {/* Workout Categories */}
        {Object.entries(workoutLibrary).map(([categoryKey, category]) => (
          <View key={categoryKey} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
            
            <View style={styles.workoutList}>
              {category.workouts.map((workout) => (
                <TouchableOpacity
                  key={workout.id}
                  style={[
                    styles.workoutCard,
                    expandedWorkout === workout.id && styles.workoutCardExpanded
                  ]}
                  onPress={() => toggleWorkoutExpansion(workout.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.workoutHeader}>
                    <View style={styles.workoutHeaderLeft}>
                      <Text style={styles.workoutName}>{workout.name}</Text>
                      <Text style={styles.workoutMeta}>
                        {workout.duration} min • {workout.calories} cal burned
                      </Text>
                    </View>
                    <Ionicons 
                      name={expandedWorkout === workout.id ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#64748b" 
                    />
                  </View>
                  
                  {expandedWorkout === workout.id && (
                    <View style={styles.workoutDetails}>
                      <Text style={styles.exercisesTitle}>Exercises:</Text>
                      {workout.exercises.map((exercise, index) => (
                        <Text key={index} style={styles.exerciseItem}>
                          • {exercise}
                        </Text>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#f5f7fb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginRight: 40, // Offset for back button
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  introDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    fontWeight: '500',
  },
  workoutList: {
    gap: 12,
  },
  workoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  workoutCardExpanded: {
    borderColor: '#10b981',
    borderWidth: 2,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutHeaderLeft: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  workoutMeta: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6366f1',
  },
  workoutDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  exercisesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  exerciseItem: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
    fontWeight: '500',
  },
});