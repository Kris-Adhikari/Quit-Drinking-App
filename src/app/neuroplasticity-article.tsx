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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function NeuroplasticityArticle() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.taskId as string;
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
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
        const completedTasks = await AsyncStorage.getItem('completedTasks');
        const parsedTasks = completedTasks ? JSON.parse(completedTasks) : {};
        parsedTasks[taskId] = true;
        await AsyncStorage.setItem('completedTasks', JSON.stringify(parsedTasks));
        
        setIsCompleted(true);
        
        setTimeout(() => {
          router.back();
        }, 1000);
      } catch (error) {
        console.log('Error saving task completion:', error);
      }
    }
  };

  const handleShare = () => {
    console.log('Share article');
  };

  const handleBookmark = () => {
    console.log('Bookmark article');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fb" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Article Content */}
        <View style={styles.articleContainer}>
          <Text style={styles.category}>NEUROSCIENCE</Text>
          <Text style={styles.title}>Changing Our Brains Through Neuroplasticity</Text>
          <Text style={styles.readTime}>3 min read</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.paragraph}>
            Neuroplasticity is the brain's remarkable ability to reorganize itself by forming new neural connections 
            throughout life. This incredible capacity means that our brains are constantly adapting and changing based 
            on our experiences, thoughts, and behaviors.
          </Text>
          
          <Text style={styles.paragraph}>
            When it comes to addiction recovery, understanding neuroplasticity gives us hope. The same brain that 
            developed addiction patterns can be rewired to support recovery. Every time we choose a healthy behavior 
            over an addictive one, we're literally rewiring our neural pathways.
          </Text>
          
          <Text style={styles.subheading}>How Neuroplasticity Works in Recovery</Text>
          
          <Text style={styles.paragraph}>
            The process of neuroplasticity in recovery involves several key mechanisms:
          </Text>
          
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Synaptic Plasticity:</Text> The strength of connections between neurons can 
              increase or decrease based on our repeated behaviors and thoughts.
            </Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Structural Plasticity:</Text> New neurons can be generated, and existing 
              neural pathways can be modified or replaced with healthier alternatives.
            </Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Functional Plasticity:</Text> Different areas of the brain can take over 
              functions that were previously managed by addiction-affected regions.
            </Text>
          </View>
          
          <Text style={styles.subheading}>Practical Applications</Text>
          
          <Text style={styles.paragraph}>
            Understanding neuroplasticity empowers us to take active steps in our recovery:
          </Text>
          
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Mindfulness and Meditation:</Text> Regular practice strengthens the prefrontal 
            cortex, improving decision-making and emotional regulation while reducing the power of addiction-related 
            neural pathways.
          </Text>
          
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>New Learning:</Text> Engaging in new activities, learning new skills, or 
            pursuing hobbies creates alternative neural pathways that compete with addiction patterns.
          </Text>
          
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Physical Exercise:</Text> Regular exercise promotes the production of 
            brain-derived neurotrophic factor (BDNF), which supports the growth of new neurons and connections.
          </Text>
          
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Social Connections:</Text> Healthy relationships activate reward pathways 
            in positive ways, helping to replace the artificial reward systems created by addiction.
          </Text>
          
          <Text style={styles.subheading}>The Time Factor</Text>
          
          <Text style={styles.paragraph}>
            Neuroplastic changes don't happen overnight. Research suggests that it takes approximately 66 days on 
            average to form a new habit, but the timeline can vary significantly between individuals and behaviors. 
            The key is consistency and patience.
          </Text>
          
          <Text style={styles.paragraph}>
            Remember, every day of recovery is a day your brain is healing and rewiring itself. Each healthy choice 
            you make strengthens the neural pathways that support your recovery journey.
          </Text>
          
          <View style={styles.calloutBox}>
            <Text style={styles.calloutText}>
              "The brain that got addicted is not the brain that gets sober. Recovery involves the creation of 
              new neural pathways and the strengthening of healthier patterns of thinking and behavior."
            </Text>
            <Text style={styles.calloutAuthor}>- Dr. Judith Grisel, Neuroscientist</Text>
          </View>
          
          <Text style={styles.paragraph}>
            Your brain is incredibly resilient and adaptable. Trust in its ability to heal and change, and 
            remember that every step you take in recovery is literally reshaping your mind for the better.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[styles.completeButton, isCompleted && styles.completeButtonCompleted]}
          onPress={handleComplete}
          disabled={isCompleted}
        >
          <Text style={[styles.completeButtonText, isCompleted && styles.completeButtonTextCompleted]}>
            {isCompleted ? 'Completed! ✓' : 'Mark as Complete'}
          </Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  articleContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e3a8a',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 36,
    marginBottom: 8,
  },
  readTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 8,
    marginBottom: 16,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingRight: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: '700',
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    flex: 1,
  },
  bold: {
    fontWeight: '700',
    color: '#1a1a1a',
  },
  calloutBox: {
    backgroundColor: '#f0f4ff',
    borderLeftWidth: 4,
    borderLeftColor: '#1e3a8a',
    padding: 20,
    marginVertical: 24,
    borderRadius: 8,
  },
  calloutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  calloutAuthor: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f5f7fb',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  completeButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completeButtonCompleted: {
    backgroundColor: '#4CAF50',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  completeButtonTextCompleted: {
    color: '#ffffff',
  },
});