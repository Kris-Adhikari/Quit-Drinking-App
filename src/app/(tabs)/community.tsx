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
  KeyboardAvoidingView,
  Platform,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCommunity } from '@/hooks/use-community';
import { useAuth } from '@/hooks/use-auth';

export default function Community() {
  const router = useRouter();
  const { user } = useAuth();
  const { posts, loading, createPost, toggleLike, isPostLiked, formatTimestamp } = useCommunity();
  const [newPost, setNewPost] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  const handleLike = async (postId: string) => {
    await toggleLike(postId);
  };

  const handlePost = async () => {
    if (newPost.trim() && !isPosting) {
      setIsPosting(true);
      const success = await createPost(newPost, isAnonymous);
      if (success) {
        setNewPost('');
        setIsWriting(false);
      }
      setIsPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#e8f4ff" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={32} color="#4a90e2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forum</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#4a90e2" />
          </TouchableOpacity>
        </View>

        {/* Post Input */}
        <View style={styles.postInputContainer}>
          <TouchableOpacity 
            style={styles.postInputTouchable}
            onPress={() => setIsWriting(true)}
            activeOpacity={0.9}
          >
            <Ionicons name="person-circle" size={40} color="#4a90e2" />
            <View style={styles.postInputWrapper}>
              {isWriting ? (
                <TextInput
                  style={styles.postInput}
                  placeholder="How are you feeling today?"
                  placeholderTextColor="#999"
                  value={newPost}
                  onChangeText={setNewPost}
                  multiline
                  autoFocus
                  onBlur={() => {
                    if (!newPost.trim()) setIsWriting(false);
                  }}
                />
              ) : (
                <Text style={styles.postInputPlaceholder}>
                  How are you feeling today?
                </Text>
              )}
            </View>
            {isWriting && newPost.trim() && (
              <TouchableOpacity onPress={handlePost} style={styles.sendButton} disabled={isPosting}>
                {isPosting ? (
                  <ActivityIndicator size="small" color="#4a90e2" />
                ) : (
                  <Ionicons name="send" size={20} color="#4a90e2" />
                )}
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          
          {/* Anonymous Toggle */}
          {isWriting && (
            <View style={styles.anonymousToggle}>
              <Text style={styles.anonymousLabel}>Post anonymously</Text>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: '#e0e0e0', true: '#4a90e2' }}
                thumbColor={isAnonymous ? '#fff' : '#f4f3f4'}
              />
            </View>
          )}
        </View>

        {/* Posts */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4a90e2" />
              <Text style={styles.loadingText}>Loading posts...</Text>
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No posts yet</Text>
              <Text style={styles.emptySubtitle}>Be the first to share your journey!</Text>
            </View>
          ) : (
            posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.authorSection}>
                    <Ionicons name="person-circle" size={40} color="#4a90e2" />
                    <View>
                      <Text style={styles.authorName}>{post.author_name}</Text>
                      {post.is_anonymous && (
                        <Text style={styles.anonymousLabel}>Anonymous</Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.timestamp}>{formatTimestamp(post.created_at)}</Text>
                </View>
                
                <Text style={styles.postContent}>{post.content}</Text>
                
                <View style={styles.postActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleLike(post.id)}
                  >
                    <Ionicons 
                      name={isPostLiked(post.id) ? "heart" : "heart-outline"} 
                      size={24} 
                      color={isPostLiked(post.id) ? "#ff4757" : "#999"} 
                    />
                    <Text style={styles.actionCount}>{post.likes_count}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={24} color="#999" />
                    {post.comments_count > 0 && (
                      <Text style={styles.actionCount}>{post.comments_count}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4ff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Increased top padding for status bar
    paddingBottom: 15,
    backgroundColor: '#e8f4ff',
  },
  profileButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  searchButton: {
    padding: 8,
  },
  postInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  postInputWrapper: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  postInput: {
    fontSize: 16,
    color: '#1a1a1a',
    minHeight: 24,
    maxHeight: 120,
    paddingTop: 0,
    paddingBottom: 0,
  },
  postInputPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  sendButton: {
    padding: 8,
    marginTop: -4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  timestamp: {
    fontSize: 14,
    color: '#999',
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionCount: {
    fontSize: 14,
    color: '#999',
  },
});