import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

type BreathingPhase = 'inhale' | 'exhale';

export default function BreathingExercise() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;
  
  // Store timeout reference
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Timing intervals
  const phaseTimings = {
    inhale: 4000,    // 4 seconds
    exhale: 4000,    // 4 seconds
  };

  const phaseTexts = {
    inhale: 'Inhale',
    exhale: 'Exhale',
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      // Start the breathing cycle
      startBreathingCycle();
      
      // Timer for total session time
      interval = setInterval(() => {
        setTotalTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (phaseTimeoutRef.current) {
        clearTimeout(phaseTimeoutRef.current);
        phaseTimeoutRef.current = null;
      }
    };
  }, [isActive]);

  const startBreathingCycle = () => {
    runPhase('inhale');
  };

  const runPhase = (phase: BreathingPhase) => {
    if (!isActive && phase === 'inhale') return;
    
    setCurrentPhase(phase);
    
    // Animate based on phase
    if (phase === 'inhale') {
      animateInhale();
    } else {
      animateExhale();
    }

    // Schedule next phase
    const nextPhase = phase === 'inhale' ? 'exhale' : 'inhale';
    const duration = phaseTimings[phase];
    
    // Clear any existing timeout
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
    }
    
    // Set new timeout
    phaseTimeoutRef.current = setTimeout(() => {
      if (isActive) {
        if (phase === 'exhale') {
          setCycleCount(prev => prev + 1);
        }
        runPhase(nextPhase);
      }
    }, duration);
  };

  const animateInhale = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: phaseTimings.inhale,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: phaseTimings.inhale,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateExhale = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: phaseTimings.exhale,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: phaseTimings.exhale,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleStart = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setCycleCount(0);
    setTotalTime(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    
    // Clear any pending timeouts
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
    
    // Stop all animations
    scaleAnim.stopAnimation();
    opacityAnim.stopAnimation();
    
    // Reset animations
    scaleAnim.setValue(0.8);
    opacityAnim.setValue(0.7);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    return currentPhase === 'inhale' ? '#4CAF50' : '#2196F3';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Breathing Exercise</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Simple Breathing</Text>
          <Text style={styles.instructionsText}>
            Breathe in for 4 seconds, then breathe out for 4 seconds. Follow the circle as it grows and shrinks to guide your breathing rhythm.
          </Text>
        </View>

        {/* Breathing Circle */}
        <View style={styles.breathingContainer}>
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
                backgroundColor: getPhaseColor(),
              }
            ]}
          >
            <View style={styles.breathingInner}>
              <Text style={styles.phaseText}>{phaseTexts[currentPhase]}</Text>
              {isActive && (
                <Text style={styles.phaseSubtext}>
                  {currentPhase === 'inhale' && 'Fill your lungs'}
                  {currentPhase === 'exhale' && 'Release slowly'}
                </Text>
              )}
            </View>
          </Animated.View>
          
          {/* Outer ring for visual depth */}
          <View style={styles.outerRing} />
        </View>

        {/* Stats */}
        {isActive && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{cycleCount}</Text>
              <Text style={styles.statLabel}>Cycles</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatTime(totalTime)}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!isActive ? (
            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleStart}
            >
              <Ionicons name="play" size={24} color="#ffffff" />
              <Text style={styles.startButtonText}>Start Breathing</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.stopButton}
              onPress={handleStop}
            >
              <Ionicons name="stop" size={24} color="#ffffff" />
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tips */}
        {!isActive && (
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Tips for Best Results</Text>
            <Text style={styles.tipsText}>
              • Find a quiet, comfortable place{'\n'}
              • Sit or lie down with your back straight{'\n'}
              • Focus on the circle and breathe naturally{'\n'}
              • Practice regularly for maximum benefit
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a237e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  instructionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 20,
    textAlign: 'center',
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    position: 'relative',
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  breathingInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  phaseSubtext: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 4,
  },
  controlsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  stopButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  stopButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  tipsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 20,
  },
});