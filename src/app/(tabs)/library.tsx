import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock articles data
const mockArticles = [
  {
    id: '1',
    title: 'Understanding Alcohol and Your Brain',
    category: 'Science',
    readTime: '5 min',
    author: 'Dr. Sarah Mitchell',
    summary: 'Learn how alcohol affects your brain chemistry and why breaking the habit can lead to significant improvements in mental clarity.',
    imageUrl: null,
    featured: true,
  },
  {
    id: '2',
    title: '10 Benefits of Reducing Alcohol Intake',
    category: 'Health',
    readTime: '3 min',
    author: 'Health Team',
    summary: 'Discover the immediate and long-term benefits of cutting back on alcohol, from better sleep to improved relationships.',
    imageUrl: null,
    featured: true,
  },
  {
    id: '3',
    title: 'Mindful Strategies for Social Situations',
    category: 'Tips',
    readTime: '4 min',
    author: 'Emma Thompson',
    summary: 'Practical tips for navigating social events without drinking and still having a great time.',
    imageUrl: null,
    featured: false,
  },
  {
    id: '4',
    title: 'The Science of Habit Formation',
    category: 'Science',
    readTime: '6 min',
    author: 'Dr. James Chen',
    summary: 'Understanding how habits form and how to replace unhealthy patterns with positive ones.',
    imageUrl: null,
    featured: false,
  },
  {
    id: '5',
    title: 'Success Stories: 30 Days Alcohol-Free',
    category: 'Stories',
    readTime: '7 min',
    author: 'Community',
    summary: 'Real stories from people who have successfully completed 30 days without alcohol and how it changed their lives.',
    imageUrl: null,
    featured: false,
  },
  {
    id: '6',
    title: 'Nutrition Tips for Recovery',
    category: 'Health',
    readTime: '5 min',
    author: 'Nutritionist Team',
    summary: 'Foods and supplements that can help your body recover and reduce cravings.',
    imageUrl: null,
    featured: false,
  },
];

const categories = ['All', 'Science', 'Health', 'Tips', 'Stories'];

export default function Library() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const handleArticlePress = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured</Text>
            {featuredArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.featuredCard}
                onPress={() => handleArticlePress(article.id)}
                activeOpacity={0.9}
              >
                <View style={styles.featuredContent}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{article.category}</Text>
                  </View>
                  <Text style={styles.featuredTitle}>{article.title}</Text>
                  <Text style={styles.featuredSummary} numberOfLines={2}>
                    {article.summary}
                  </Text>
                  <View style={styles.featuredMeta}>
                    <Text style={styles.author}>{article.author}</Text>
                    <Text style={styles.readTime}>{article.readTime} read</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Regular Articles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Articles</Text>
          {regularArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleCard}
              onPress={() => handleArticlePress(article.id)}
              activeOpacity={0.9}
            >
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleSummary} numberOfLines={2}>
                  {article.summary}
                </Text>
                <View style={styles.articleMeta}>
                  <View style={styles.articleMetaLeft}>
                    <Text style={styles.articleCategory}>{article.category}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.readTime}>{article.readTime}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999999" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#cccccc" />
            <Text style={styles.emptyStateText}>No articles found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  bookmarkButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoriesContent: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#8B5CF6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  featuredCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  featuredContent: {
    gap: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 26,
  },
  featuredSummary: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  author: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  readTime: {
    fontSize: 14,
    color: '#999999',
  },
  articleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  articleContent: {
    gap: 8,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 24,
  },
  articleSummary: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  articleMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  articleCategory: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  metaDot: {
    fontSize: 12,
    color: '#cccccc',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
  },
});