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
  const [isPosting, setIsPosting] = useState(false);


  const handleLike = async (postId: string) => {
    await toggleLike(postId);
  };

  const handlePost = async () => {
    if (newPost.trim() && !isPosting) {
      setIsPosting(true);
      const success = await createPost(newPost, true); // Always post anonymously
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
          <Text style={styles.headerTitle}>Forum</Text>
        </View>

        {/* Post Input */}
        <View style={styles.postSection}>
          <Text style={styles.postPrompt}>Tap below to share your thoughts and connect with the community</Text>
          <View style={styles.postInputContainer}>
            <Ionicons name="person-circle" size={40} color="#4a90e2" />
            <TouchableOpacity 
              style={styles.postInputTouchable}
              onPress={() => setIsWriting(true)}
              activeOpacity={0.9}
            >
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
            </TouchableOpacity>
            {isWriting && newPost.trim() && (
              <TouchableOpacity onPress={handlePost} style={styles.sendButton} disabled={isPosting}>
                {isPosting ? (
                  <ActivityIndicator size="small" color="#4a90e2" />
                ) : (
                  <Ionicons name="send" size={20} color="#4a90e2" />
                )}
              </TouchableOpacity>
            )}
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Increased top padding for status bar
    paddingBottom: 15,
    backgroundColor: '#e8f4ff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  postSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  postPrompt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  postInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  postInputTouchable: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  postInputWrapper: {
    flex: 1,
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
    alignSelf: 'flex-end',
    marginLeft: 8,
  },
  anonymousLabel: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
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