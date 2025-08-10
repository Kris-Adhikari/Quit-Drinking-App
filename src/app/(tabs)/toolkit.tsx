import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { alcoholSwapTips } from '@/lib/weight-loss-content';
import { workoutLibrary } from '@/lib/workout-content';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding
const swapCardWidth = width - 80; // Card width with good margins

export default function Toolkit() {
  const router = useRouter();
  const [activeSwapIndex, setActiveSwapIndex] = useState(0);
  const swapScrollRef = useRef<ScrollView>(null);

  const cravingTools = [
    {
      id: '1',
      title: 'Coping Strategies',
      icon: 'chess-rook',
      backgroundColor: '#e8f0ff',
      iconColor: '#7c8599',
    },
    {
      id: '2',
      title: 'Craving Diary',
      icon: 'notebook',
      backgroundColor: '#ffe8e8',
      iconColor: '#ff9999',
    },
  ];

  const mindfulnessTools = [
    {
      id: '3',
      title: 'Breathing Exercise',
      icon: 'circle-outline',
      backgroundColor: '#e8f5f5',
      iconColor: '#7cc5c5',
    },
    {
      id: '4',
      title: 'Meditation',
      icon: 'blur',
      backgroundColor: '#f0e8ff',
      iconColor: '#b399ff',
    },
  ];

  const handleCravingPress = () => {
    router.push('/craving-mode');
  };

  const handleToolPress = (toolId: string, toolTitle: string) => {
    switch (toolId) {
      case '1': // Coping Strategies
        router.push('/coping-strategies');
        break;
      case '2': // Craving Diary
        router.push('/craving-diary');
        break;
      case '3': // Breathing Exercise
        router.push('/breathing-exercise');
        break;
      case '4': // Meditation
        router.push('/meditation');
        break;
      default:
        console.log(`Tool pressed: ${toolTitle}`);
        // Navigate to specific tool
        break;
    }
  };

  const handleAITherapistPress = () => {
    router.push('/ai-therapist');
  };

  const handlePrivateCoachingPress = () => {
    // TODO: Redirect to Calendly link
    console.log('Private coaching pressed - Calendly integration pending');
  };

  const handleWorkoutLibraryPress = () => {
    router.push('/workout-library');
  };

  const handleSwapScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x + 40; // Account for initial offset
    const cardWithGap = swapCardWidth + 16;
    const index = Math.round(contentOffsetX / cardWithGap);
    const clampedIndex = Math.max(0, Math.min(index, alcoholSwapTips.length - 1));
    setActiveSwapIndex(clampedIndex);
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Toolkit</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* I Have a Craving Banner */}
        <TouchableOpacity 
          style={styles.cravingBanner}
          onPress={handleCravingPress}
          activeOpacity={0.9}
        >
          <View style={styles.cravingContent}>
            <Text style={styles.cravingTitle}>I Have a Craving</Text>
            <Text style={styles.cravingSubtitle}>
              Power through your cravings with these tools!
            </Text>
          </View>
          <View style={styles.brainIconContainer}>
            <MaterialCommunityIcons name="head-lightbulb" size={60} color="#ffffff" />
          </View>
        </TouchableOpacity>

        {/* AI Therapist Section */}
        <TouchableOpacity 
          style={styles.aiTherapistBanner}
          onPress={handleAITherapistPress}
          activeOpacity={0.9}
        >
          <View style={styles.aiTherapistContent}>
            <Text style={styles.aiTherapistTitle}>AI Therapist</Text>
            <Text style={styles.aiTherapistSubtitle}>
              24/7 support from your personal AI recovery companion
            </Text>
          </View>
          <View style={styles.aiIconContainer}>
            <MaterialCommunityIcons name="robot-excited" size={60} color="#ffffff" />
          </View>
        </TouchableOpacity>

        {/* Weight-Loss Swap Tips Section */}
        <View style={styles.swapTipsSection}>
          <View style={styles.swapTipsHeader}>
            <Text style={styles.swapTipsIcon}>🥗</Text>
            <Text style={styles.swapTipsTitle}>Weight Loss Swaps</Text>
          </View>
          <Text style={styles.swapTipsSubtitle}>
            Smart alternatives that support your goals
          </Text>
          
          <ScrollView 
            ref={swapScrollRef}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            onScroll={handleSwapScroll}
            scrollEventThrottle={16}
            style={styles.swapCardsContainer}
            contentContainerStyle={styles.swapCardsContentContainer}
            snapToInterval={swapCardWidth + 16} // Card width plus gap
            snapToAlignment="start"
            decelerationRate="fast"
            contentInset={{ left: 40, right: 40 }}
            contentOffset={{ x: -40, y: 0 }}
          >
            {alcoholSwapTips.map((category, index) => (
              <View 
                key={index} 
                style={[
                  styles.swapCard, 
                  { width: swapCardWidth },
                  index === 0 && { marginLeft: 40 },
                  index === alcoholSwapTips.length - 1 && { marginRight: 40 }
                ]}
              >
                <Text style={styles.swapCardTitle}>{category.title}</Text>
                <View style={styles.swapCardDivider} />
                <View style={styles.swapCardContent}>
                  {category.tips.slice(0, 3).map((tip, tipIndex) => (
                    <View key={tipIndex} style={styles.swapCardTip}>
                      <Text style={styles.swapCardBullet}>•</Text>
                      <Text style={styles.swapCardTipText} numberOfLines={2} ellipsizeMode="tail">
                        {tip}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
          
          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {alcoholSwapTips.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeSwapIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Workout Library Section */}
        <TouchableOpacity 
          style={styles.workoutLibraryBanner}
          onPress={handleWorkoutLibraryPress}
          activeOpacity={0.9}
        >
          <View style={styles.workoutLibraryContent}>
            <Text style={styles.workoutLibraryTitle}>Workout Library</Text>
            <Text style={styles.workoutLibrarySubtitle}>
              Exercise routines designed for cravings and weight loss
            </Text>
          </View>
          <View style={styles.workoutIconContainer}>
            <MaterialCommunityIcons name="dumbbell" size={60} color="#ffffff" />
          </View>
        </TouchableOpacity>

        {/* Private Coaching Section */}
        <TouchableOpacity 
          style={styles.coachingBanner}
          onPress={handlePrivateCoachingPress}
          activeOpacity={0.9}
        >
          <View style={styles.coachingContent}>
            <Text style={styles.coachingTitle}>Private Coaching</Text>
            <Text style={styles.coachingSubtitle}>
              One-on-one sessions with certified recovery coaches
            </Text>
          </View>
          <View style={styles.coachingIconContainer}>
            <MaterialCommunityIcons name="account-tie" size={60} color="#ffffff" />
          </View>
        </TouchableOpacity>

        {/* Cravings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cravings</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Document your cravings and be reminded of the reason you started your journey
          </Text>
          
          <View style={styles.toolsGrid}>
            {cravingTools.map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={[styles.toolCard, { backgroundColor: tool.backgroundColor }]}
                onPress={() => handleToolPress(tool.id, tool.title)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons 
                  name={tool.icon as any} 
                  size={48} 
                  color={tool.iconColor} 
                />
                <Text style={styles.toolTitle}>{tool.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mindfulness Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mindfulness</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Enhance your daily routine. Practice mindfulness, discover helpful breathing techniques, and more!
          </Text>
          
          <View style={styles.toolsGrid}>
            {mindfulnessTools.map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={[styles.toolCard, { backgroundColor: tool.backgroundColor }]}
                onPress={() => handleToolPress(tool.id, tool.title)}
                activeOpacity={0.8}
              >
                {tool.icon === 'circle-outline' ? (
                  <View style={styles.breathingIcon}>
                    <View style={styles.breathingCircle} />
                    <View style={styles.breathingDot} />
                  </View>
                ) : (
                  <MaterialCommunityIcons 
                    name={tool.icon as any} 
                    size={48} 
                    color={tool.iconColor} 
                  />
                )}
                <Text style={styles.toolTitle}>{tool.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Increased top padding for status bar
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cravingBanner: {
    backgroundColor: '#4169e1',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cravingContent: {
    flex: 1,
    paddingRight: 20,
  },
  cravingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  cravingSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 20,
  },
  brainIconContainer: {
    position: 'relative',
  },
  aiTherapistBanner: {
    backgroundColor: '#7c3aed',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  aiTherapistContent: {
    flex: 1,
    paddingRight: 20,
  },
  aiTherapistTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  aiTherapistSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 20,
  },
  aiIconContainer: {
    position: 'relative',
  },
  coachingBanner: {
    backgroundColor: '#059669',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  coachingContent: {
    flex: 1,
    paddingRight: 20,
  },
  coachingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  coachingSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 20,
  },
  coachingIconContainer: {
    position: 'relative',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  toolsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  toolCard: {
    width: cardWidth,
    height: cardWidth * 0.85,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  breathingIcon: {
    width: 48,
    height: 48,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#7cc5c5',
    position: 'absolute',
  },
  breathingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7cc5c5',
    position: 'absolute',
    top: -6,
  },
  // Weight-Loss Swap Tips Styles
  swapTipsSection: {
    marginBottom: 30,
  },
  swapTipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  swapTipsIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  swapTipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#14532d',
  },
  swapTipsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  swapCardsContainer: {
    marginHorizontal: -20,
    height: 210,
  },
  swapCardsContentContainer: {
    paddingVertical: 10,
  },
  swapCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    height: 190,
    overflow: 'hidden',
  },
  swapCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15803d',
    marginBottom: 8,
  },
  swapCardDivider: {
    height: 1,
    backgroundColor: '#bbf7d0',
    marginBottom: 10,
  },
  swapCardTip: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 10, // Add padding to prevent text cutoff
  },
  swapCardBullet: {
    fontSize: 12,
    color: '#16a34a',
    marginRight: 8,
    marginTop: 1,
    flexShrink: 0, // Prevent bullet from shrinking
  },
  swapCardTipText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
  },
  swapCardContent: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1fae5',
  },
  paginationDotActive: {
    backgroundColor: '#16a34a',
    width: 24,
  },
  // Workout Library Banner Styles
  workoutLibraryBanner: {
    backgroundColor: '#10b981',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  workoutLibraryContent: {
    flex: 1,
  },
  workoutLibraryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  workoutLibrarySubtitle: {
    fontSize: 16,
    color: '#d1fae5',
    fontWeight: '500',
  },
  workoutIconContainer: {
    marginLeft: 16,
  },
});