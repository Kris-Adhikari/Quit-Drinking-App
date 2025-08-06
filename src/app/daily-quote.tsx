import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  LinearGradient,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface Quote {
  text: string;
  author: string;
}

const motivationalQuotes: Quote[] = [
  {
    text: "Failure is instructive. The person who really thinks learns quite as much from his failures as from his successes.",
    author: "John Dewey"
  },
  {
    text: "The first step towards getting somewhere is to decide you're not going to stay where you are.",
    author: "J.P. Morgan"
  },
  {
    text: "Recovery is not a destination, it's a way of life.",
    author: "Anonymous"
  },
  {
    text: "Every moment is a fresh beginning.",
    author: "T.S. Eliot"
  },
  {
    text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne"
  }
];

export default function DailyQuote() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.taskId as string;
  const [currentQuote, setCurrentQuote] = useState<Quote>(motivationalQuotes[0]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Get quote based on current date to ensure consistency
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const quoteIndex = dayOfYear % motivationalQuotes.length;
    setCurrentQuote(motivationalQuotes[quoteIndex]);

    // Check if task is already completed
    if (taskId) {
      checkTaskCompletion();
    }
  }, [taskId]);

  const checkTaskCompletion = async () => {
    try {
      const completedTasks = await AsyncStorage.getItem('completedTasks');
      const parsedTasks = completedTasks ? JSON.parse(completedTasks) : {};
      setIsCompleted(parsedTasks[taskId] || false);
    } catch (error) {
      console.log('Error checking task completion:', error);
    }
  };

  const handleComplete = async () => {
    if (taskId) {
      try {
        // Save task completion to AsyncStorage
        const completedTasks = await AsyncStorage.getItem('completedTasks');
        const parsedTasks = completedTasks ? JSON.parse(completedTasks) : {};
        parsedTasks[taskId] = true;
        await AsyncStorage.setItem('completedTasks', JSON.stringify(parsedTasks));
        
        setIsCompleted(true);
        
        // Navigate back to daily screen after a short delay
        setTimeout(() => {
          router.back();
        }, 1000);
      } catch (error) {
        console.log('Error saving task completion:', error);
      }
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background with gradient */}
      <View style={styles.background}>
        {/* Decorative circles */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
        <View style={[styles.circle, styles.circle4]} />
        
        {/* Sparkle effects */}
        <Text style={[styles.sparkle, styles.sparkle1]}>✨</Text>
        <Text style={[styles.sparkle, styles.sparkle2]}>⭐</Text>
        <Text style={[styles.sparkle, styles.sparkle3]}>✨</Text>
        <Text style={[styles.sparkle, styles.sparkle4]}>⭐</Text>
        <Text style={[styles.sparkle, styles.sparkle5]}>✨</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Quote</Text>
      </View>

      {/* Quote Container */}
      <View style={styles.content}>
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>{currentQuote.text}</Text>
          <Text style={styles.quoteAuthor}>{currentQuote.author}</Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[styles.completeButton, isCompleted && styles.completeButtonCompleted]}
          onPress={handleComplete}
          disabled={isCompleted}
        >
          <Text style={[styles.completeButtonText, isCompleted && styles.completeButtonTextCompleted]}>
            {isCompleted ? 'Completed! ✓' : 'Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4a686',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 1000,
  },
  circle1: {
    width: 200,
    height: 200,
    top: height * 0.15,
    left: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    top: height * 0.7,
    right: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.25,
    right: width * 0.2,
  },
  circle4: {
    width: 80,
    height: 80,
    bottom: height * 0.3,
    left: width * 0.1,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sparkle1: {
    top: height * 0.15,
    left: width * 0.2,
  },
  sparkle2: {
    top: height * 0.25,
    right: width * 0.15,
  },
  sparkle3: {
    top: height * 0.35,
    left: width * 0.1,
  },
  sparkle4: {
    bottom: height * 0.3,
    right: width * 0.3,
  },
  sparkle5: {
    bottom: height * 0.25,
    left: width * 0.3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    position: 'relative',
  },
  backButton: {
    padding: 8,
    position: 'absolute',
    left: 20,
    top: 52,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  quoteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: width * 0.5,
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 20,
  },
  quoteAuthor: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  completeButton: {
    backgroundColor: '#8B7355',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
  },
  completeButtonCompleted: {
    backgroundColor: '#4CAF50',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  completeButtonTextCompleted: {
    color: '#fff',
  },
});