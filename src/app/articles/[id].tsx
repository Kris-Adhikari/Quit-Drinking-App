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
import { alcoholArticles, AlcoholArticle } from '@/data/alcohol-articles';

const { width } = Dimensions.get('window');

export default function ArticlePage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const articleId = params.id as string;
  const taskId = params.taskId as string;
  const [article, setArticle] = useState<AlcoholArticle | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Find the article by ID
    const foundArticle = alcoholArticles.find(a => a.id === articleId);
    setArticle(foundArticle || null);

    if (taskId) {
      checkTaskCompletion();
    }
  }, [articleId, taskId]);

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

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f7fb" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Article not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fb" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Article Content */}
        <View style={styles.articleContainer}>
          <Text style={styles.category}>{article.category}</Text>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.readTime}>{article.duration}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.paragraph}>{article.content.introduction}</Text>
          
          {article.content.sections.map((section, index) => (
            <View key={index}>
              <Text style={styles.subheading}>{section.heading}</Text>
              <Text style={styles.paragraph}>{section.content}</Text>
              
              {section.bulletPoints && (
                <View>
                  {section.bulletPoints.map((point, bulletIndex) => (
                    <View key={bulletIndex} style={styles.bulletPoint}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletText}>
                        {point.includes(':') ? (
                          <>
                            <Text style={styles.bold}>{point.split(':')[0]}:</Text>
                            {point.split(':')[1]}
                          </>
                        ) : (
                          point
                        )}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
          
          {article.content.callout && (
            <View style={styles.calloutBox}>
              <Text style={styles.calloutText}>"{article.content.callout.text}"</Text>
              <Text style={styles.calloutAuthor}>- {article.content.callout.author}</Text>
            </View>
          )}
          
          <Text style={styles.paragraph}>{article.content.conclusion}</Text>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      {taskId && (
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
      )}
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
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: '600',
  },
});