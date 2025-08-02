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

const toolsAndChallenges = [
  {
    id: 'diary',
    title: 'Diary',
    type: 'tool',
  },
  {
    id: 'eft_tapping',
    title: 'EFT Tapping',
    type: 'tool',
  },
  {
    id: 'focus',
    title: 'Focus',
    type: 'tool',
  },
  {
    id: 'recovery_story',
    title: 'Recovery Story',
    type: 'tool',
  },
  {
    id: 'power_of_love',
    title: 'The Power of Love',
    duration: '7 mins',
    type: 'challenge',
  },
  {
    id: 'meditation',
    title: 'Meditation for Suc...',
    duration: '6 mins',
    type: 'challenge',
  },
  {
    id: 'believe_in_you',
    title: 'I Believe in You',
    duration: '6 mins',
    type: 'challenge',
  },
  {
    id: 'nutrition',
    title: 'Nutrition for AF Life',
    duration: '7 days',
    type: 'course',
  },
  {
    id: 'coping',
    title: 'Coping with Negati...',
    duration: '6 days',
    type: 'course',
  },
  {
    id: 'rest_after_slip',
    title: 'How to Rest After a Slip',
    duration: '10 days',
    type: 'course',
  },
];

export default function ChallengesPreview() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/onboarding/typical-week');
  };

  const handleBack = () => {
    router.back();
  };

  const getCardBackgroundColor = (type: string, index: number) => {
    if (type === 'tool') {
      const colors = ['#e8f5e8', '#e8f4fd', '#f0e8fd', '#fff2e8'];
      return colors[index % colors.length];
    } else if (type === 'challenge') {
      return '#e8f4fd';
    } else {
      const colors = ['#e8f5e8', '#fff2e8', '#f0e8fd'];
      return colors[index % colors.length];
    }
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
          Evidence-based tools,{'\n'}
          courses, challenges,{'\n'}
          and more.
        </Text>

        <View style={styles.gridContainer}>
          {toolsAndChallenges.map((item, index) => (
            <View key={item.id} style={[
              styles.itemCard,
              { backgroundColor: getCardBackgroundColor(item.type, index) }
            ]}>
              <View style={styles.iconPlaceholder} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.duration && (
                  <Text style={styles.itemDuration}>{item.duration}</Text>
                )}
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  itemCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    marginBottom: 12,
    opacity: 0.3,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  itemDuration: {
    fontSize: 12,
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