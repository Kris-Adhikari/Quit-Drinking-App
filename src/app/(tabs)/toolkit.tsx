import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

export default function Toolkit() {
  const router = useRouter();

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
});