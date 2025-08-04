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

export default function PlanEffects() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/(tabs)/dashboard');
  };

  const handleBack = () => {
    router.back();
  };

  const highlights = [
    {
      icon: '',
      title: 'Neuroscience-based behavior change program.',
    },
    {
      icon: '',
      title: 'Daily exercises to build long-lasting habits.',
    },
    {
      icon: '',
      title: 'Evidence-based tools, meditations, breathing exercise, courses, challenges & more.',
    },
    {
      icon: '',
      title: 'Access to supportive community (forum, virtual meetings, etc.) to inspire & answer questions.',
    },
  ];

  const focusAreas = [
    'Improve overall health and wellness',
    'Get better sleep',
    'Improve relationships with others',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Customized Plan Header */}
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            Since you selected to control your alcohol use, we've developed a customized plan to decrease in alcohol use within 3 months.
          </Text>
        </View>

        {/* Section 2: Highlights */}
        <View style={styles.section}>
          <Text style={styles.highlightsTitle}>Highlights of your customized plan:</Text>
          
          <View style={styles.highlightsList}>
            {highlights.map((highlight, index) => (
              <View key={index} style={styles.highlightItem}>
                <View style={styles.iconPlaceholder} />
                <Text style={styles.highlightText}>{highlight.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section 3: Focus Areas */}
        <View style={styles.section}>
          <Text style={styles.focusTitle}>
            Based on your input, we will focus first on empowering you to:
          </Text>
          
          <View style={styles.focusList}>
            {focusAreas.map((area, index) => (
              <View key={index} style={styles.focusItem}>
                <View style={styles.bullet} />
                <Text style={styles.focusText}>{area}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section 4: Testimonial */}
        <View style={styles.testimonialSection}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons key={star} name="star" size={20} color="#FFD700" />
            ))}
          </View>
          
          <Text style={styles.testimonialText}>
            "This app has been a game changer for me. I've been able to cut back significantly and feel so much better physically and mentally."
          </Text>
          
          <Text style={styles.testimonialAuthor}>- Sarah M.</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>22K+</Text>
            <Text style={styles.statLabel}>Reviews on App Store</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2M+</Text>
            <Text style={styles.statLabel}>Users Choices</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Get Started for Free</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 40,
  },
  sectionText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    textAlign: 'center',
  },
  highlightsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 24,
    textAlign: 'center',
  },
  highlightsList: {
    gap: 20,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  highlightText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
    paddingTop: 18,
  },
  focusTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 24,
  },
  focusList: {
    gap: 16,
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1a1a1a',
  },
  focusText: {
    flex: 1,
    fontSize: 18,
    color: '#1a1a1a',
    lineHeight: 24,
  },
  testimonialSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  testimonialText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  testimonialAuthor: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#e0e0e0',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  continueButton: {
    backgroundColor: '#1e3a8a',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});