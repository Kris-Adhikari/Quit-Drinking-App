import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  Vibration,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface MeditationSession {
  duration: number;
  backgroundSound?: string;
}

export default function Meditation() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes default
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [showDurationModal, setShowDurationModal] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;
  
  const durations = [
    { label: '3 min', value: 180 },
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
    { label: '15 min', value: 900 },
    { label: '20 min', value: 1200 },
    { label: '30 min', value: 1800 },
  ];


  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  useEffect(() => {
    if (isActive) {
      startBreathingAnimation();
    } else {
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0.7);
    }
  }, [isActive]);


  const startBreathingAnimation = () => {
    const breatheIn = Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
    ]);
    
    const breatheOut = Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: 4000,
        useNativeDriver: true,
      }),
    ]);
    
    Animated.loop(
      Animated.sequence([breatheIn, breatheOut])
    ).start();
  };

  const handleComplete = () => {
    setIsActive(false);
    Vibration.vibrate([0, 300, 100, 300]);
  };

  const toggleMeditation = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      setIsActive(true);
      // Audio functionality will be added later when expo-av is installed
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(selectedDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectDuration = (duration: number) => {
    setSelectedDuration(duration);
    setTimeRemaining(duration);
    setShowDurationModal(false);
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meditation</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timerSection}>
          <Animated.View 
            style={[
              styles.breathingCircle,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              }
            ]}
          >
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
              <Text style={styles.breathingText}>
                {isActive ? 'Focus on your breath' : 'Ready to begin'}
              </Text>
            </View>
          </Animated.View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.durationButton}
            onPress={() => setShowDurationModal(true)}
          >
            <Ionicons name="time-outline" size={24} color="#ffffff" />
            <Text style={styles.controlText}>Duration</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.playButton, isActive && styles.pauseButton]}
            onPress={toggleMeditation}
          >
            <Ionicons 
              name={isActive ? 'pause' : 'play'} 
              size={32} 
              color="#ffffff" 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetTimer}
          >
            <Ionicons name="refresh-outline" size={24} color="#ffffff" />
            <Text style={styles.controlText}>Reset</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Meditation Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>• Find a quiet, comfortable space</Text>
            <Text style={styles.tipText}>• Sit with your back straight</Text>
            <Text style={styles.tipText}>• Close your eyes or soften your gaze</Text>
            <Text style={styles.tipText}>• Focus on your breath</Text>
            <Text style={styles.tipText}>• When thoughts arise, gently return to breathing</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showDurationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDurationModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDurationModal(false)}
        >
          <View style={styles.durationModal}>
            <Text style={styles.modalTitle}>Select Duration</Text>
            <View style={styles.durationGrid}>
              {durations.map((duration) => (
                <TouchableOpacity
                  key={duration.value}
                  style={[
                    styles.durationOption,
                    selectedDuration === duration.value && styles.selectedDuration
                  ]}
                  onPress={() => selectDuration(duration.value)}
                >
                  <Text style={[
                    styles.durationOptionText,
                    selectedDuration === duration.value && styles.selectedDurationText
                  ]}>
                    {duration.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  timerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.4,
    position: 'relative',
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#4169e1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  timerContainer: {
    alignItems: 'center',
    padding: 20,
  },
  timerText: {
    fontSize: 60,
    fontWeight: '300',
    color: '#ffffff',
    marginBottom: 10,
  },
  breathingText: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
  },
  durationButton: {
    alignItems: 'center',
    padding: 10,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4169e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#ff6b6b',
  },
  resetButton: {
    alignItems: 'center',
    padding: 10,
  },
  controlText: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
  },
  tipsSection: {
    marginTop: 20,
  },
  tipCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
  },
  tipText: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationModal: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 20,
    width: width * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  durationOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#3a3a3a',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDuration: {
    borderColor: '#4169e1',
    backgroundColor: '#4169e1',
  },
  durationOptionText: {
    fontSize: 16,
    color: '#cccccc',
  },
  selectedDurationText: {
    color: '#ffffff',
  },
});