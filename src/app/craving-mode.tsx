import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function CravingMode() {
  const router = useRouter();
  const [timer, setTimer] = useState(19 * 60 + 59); // Start at 19:59
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  
  // Exit popup states
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showDidYouDrink, setShowDidYouDrink] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);

  const affirmations = [
    "My story helps other people.",
    "I am stronger than my cravings.",
    "Each moment I resist makes me more powerful.",
    "I choose my future over temporary relief.",
    "My recovery journey inspires others.",
    "I am worth the effort it takes to heal."
  ];

  // Timer countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const games = [
    { id: '1', title: '2048', color: '#4a90e2' },
    { id: '2', title: 'Tetris', color: '#7b68ee' },
    { id: '3', title: 'Memory', color: '#ff6b9d' },
  ];

  // Exit flow handlers
  const handleExitPress = () => {
    setShowExitConfirm(true);
  };

  const handleExitConfirm = () => {
    setShowExitConfirm(false);
    setShowDidYouDrink(true);
  };

  const handleDidNotDrink = () => {
    setShowDidYouDrink(false);
    setShowCongratulations(true);
    
    // Auto-close congratulations after 3 seconds
    setTimeout(() => {
      setShowCongratulations(false);
      router.back();
    }, 3000);
  };

  const handleDidDrink = () => {
    setShowDidYouDrink(false);
    setShowEncouragement(true);
  };

  const handleFinalExit = () => {
    // Close all popups and go back
    setShowExitConfirm(false);
    setShowDidYouDrink(false);
    setShowCongratulations(false);
    setShowEncouragement(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleExitPress}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Craving Mode</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Craving Tools Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Craving Tools</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Did you know?</Text>
            <Text style={styles.infoText}>
              An average craving lasts 20 minutes. Use these tools to help you power through your cravings.
            </Text>
          </View>
        </View>

        {/* Games Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Games</Text>
          <View style={styles.gamesGrid}>
            {games.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={[styles.gameCard, { backgroundColor: game.color }]}
                activeOpacity={0.7}
                onPress={() => {
                  // Placeholder - no functionality yet
                  console.log(`${game.title} pressed - not implemented yet`);
                }}
              >
                <View style={styles.gameContent}>
                  {game.title === '2048' && (
                    <Text style={styles.gameNumber}>2048</Text>
                  )}
                  {game.title === 'Tetris' && (
                    <View style={styles.tetrisBlocks}>
                      <View style={[styles.block, { backgroundColor: '#ff4757' }]} />
                      <View style={[styles.block, { backgroundColor: '#ffa502' }]} />
                      <View style={[styles.block, { backgroundColor: '#2ed573' }]} />
                    </View>
                  )}
                  {game.title === 'Memory' && (
                    <View style={styles.memoryCards}>
                      <View style={styles.memoryCard} />
                      <View style={styles.memoryCard} />
                    </View>
                  )}
                </View>
                <Text style={styles.gameTitle}>{game.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Affirmations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Affirmations</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentAffirmation(index);
            }}
            contentContainerStyle={styles.affirmationsContainer}
          >
            {affirmations.map((affirmation, index) => (
              <View key={index} style={[styles.affirmationCard, { width: width - 40 }]}>
                <Text style={styles.affirmationText}>
                  {affirmation}
                </Text>
              </View>
            ))}
          </ScrollView>
          
          {/* Dots indicator */}
          <View style={styles.dotsContainer}>
            {affirmations.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  index === currentAffirmation && styles.activeDot
                ]}
                onPress={() => setCurrentAffirmation(index)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Timer Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.timerSection}>
          <Text style={styles.timerLabel}>Craving Mode</Text>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.exitButton}
          onPress={handleExitPress}
        >
          <Text style={styles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>

      {/* Exit Confirmation Modal */}
      <Modal
        visible={showExitConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExitConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Are you sure you want to{'\n'}leave Craving Mode?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowExitConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleExitConfirm}
              >
                <Text style={styles.confirmButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Did You Drink Modal */}
      <Modal
        visible={showDidYouDrink}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDidYouDrink(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Did you drink?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleDidNotDrink}
              >
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDidDrink}
              >
                <Text style={styles.confirmButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Congratulations Modal */}
      <Modal
        visible={showCongratulations}
        transparent={true}
        animationType="fade"
        onRequestClose={handleFinalExit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.celebrationModal}>
            <Text style={styles.celebrationTitle}>Well done! 👏</Text>
            <View style={styles.celebrationIcon}>
              <Text style={styles.celebrationEmoji}>🎉</Text>
              <View style={styles.celebrationSparks}>
                <Text style={styles.spark}>✨</Text>
                <Text style={styles.spark}>⭐</Text>
                <Text style={styles.spark}>✨</Text>
              </View>
            </View>
            <View style={styles.rewardBanner}>
              <Text style={styles.rewardText}>
                😊 We're proud of you for staying strong! +25 Recoins
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Encouragement Modal */}
      <Modal
        visible={showEncouragement}
        transparent={true}
        animationType="fade"
        onRequestClose={handleFinalExit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>That's okay 💙</Text>
            <Text style={styles.encouragementText}>
              Recovery isn't linear. Every attempt to manage your cravings is progress. 
              You recognized the craving and tried to do something about it - that's huge! 
              Tomorrow is a new day to try again.
            </Text>
            <TouchableOpacity 
              style={styles.okButton}
              onPress={handleFinalExit}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  header: {
    backgroundColor: '#4a90e2',
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  gamesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  gameCard: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gameContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  tetrisBlocks: {
    flexDirection: 'row',
    gap: 2,
  },
  block: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  memoryCards: {
    flexDirection: 'row',
    gap: 4,
  },
  memoryCard: {
    width: 16,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginTop: 8,
  },
  affirmationsContainer: {
    paddingRight: 40, // Account for container padding
  },
  affirmationCard: {
    backgroundColor: '#4a90e2',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  affirmationText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d0d0d0',
  },
  activeDot: {
    backgroundColor: '#4a90e2',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4a90e2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  timerSection: {
    flex: 1,
  },
  timerLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  exitButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  exitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#4a90e2',
  },
  confirmButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  // Celebration Modal Styles
  celebrationModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: '100%',
  },
  celebrationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
  },
  celebrationIcon: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  celebrationEmoji: {
    fontSize: 60,
  },
  celebrationSparks: {
    position: 'absolute',
    top: -10,
    left: -20,
    right: -20,
    bottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spark: {
    position: 'absolute',
    fontSize: 20,
  },
  rewardBanner: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  rewardText: {
    fontSize: 14,
    color: '#4a90e2',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Encouragement Modal Styles
  encouragementText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  okButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  okButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
});