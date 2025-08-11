import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const features = [
  {
    id: 'daily',
    icon: 'today-outline',
    title: 'Daily Alcohol Tracking',
    benefit: 'Log your progress and build powerful sobriety streaks',
    color: '#1e3a8a',
  },
  {
    id: 'toolkit',
    icon: 'build-outline',
    title: 'Recovery Toolkit',
    benefit: 'Access proven strategies and tools to stay alcohol-free',
    color: '#1e3a8a',
  },
  {
    id: 'me',
    icon: 'person-outline',
    title: 'Personal Progress Hub',
    benefit: 'Track your health improvements and celebrate milestones',
    color: '#1e3a8a',
  },
  {
    id: 'triggers',
    icon: 'shield-checkmark-outline',
    title: 'Trigger Management',
    benefit: 'Identify and overcome your drinking triggers with science',
    color: '#1e3a8a',
  },
];

export default function PlanOutline() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboarding/first-goal-setup');
  };

  const handleBack = () => {
    router.back();
  };

  const progress = 21 / 22; // 21st screen out of 22 total

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your neuroscience-based sobriety roadmap</Text>
        <Text style={styles.bridgeText}>
          Perfect! Based on your answers, here's your personalized path to success:
        </Text>
        <Text style={styles.subtitle}>
          Our proven program rewires your brain to quit alcohol naturally
        </Text>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={feature.id} style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <View style={[styles.iconContainer, { backgroundColor: feature.color + '20' }]}>
                  <Ionicons
                    name={feature.icon as any}
                    size={24}
                    color={feature.color}
                  />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureBenefit}>{feature.benefit}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.socialProofCard}>
          <View style={styles.successStats}>
            <Text style={styles.statsTitle}>Real Results</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>94%</Text>
                <Text style={styles.statLabel}>Reduced drinking</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5-10 lbs</Text>
                <Text style={styles.statLabel}>Weight lost (avg)</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.testimonial}>
            "30 days alcohol-free changed my life - better sleep, lost 8 lbs, and feel amazing!"
            <Text style={styles.testimonialAuthor}> - Sarah M.</Text>
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Set My Goals</Text>
          <Ionicons name="chevron-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1e3a8a',
    borderRadius: 2,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  bridgeText: {
    fontSize: 18,
    color: '#1e3a8a',
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 22,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 32,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  featureBenefit: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  socialProofCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  successStats: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  testimonial: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  testimonialAuthor: {
    fontWeight: '600',
    color: '#1e3a8a',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
});