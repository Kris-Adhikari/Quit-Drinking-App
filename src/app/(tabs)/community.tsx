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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// List of common first names for anonymous users
const anonymousNames = [
  'Alex', 'Sam', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Jamie', 'Robin',
  'Sarah', 'Mike', 'Emma', 'Chris', 'Lisa', 'David', 'Amy', 'Ryan',
  'Kelly', 'Pat', 'Lee', 'Dana', 'Blake', 'Drew', 'Quinn', 'Reese'
];

// Function to get a random anonymous name
const getRandomAnonymousName = () => {
  return anonymousNames[Math.floor(Math.random() * anonymousNames.length)];
};

// Mock posts data - anonymous poetry-style posts
const mockPosts = [
  {
    id: '1',
    author: 'Anonymous',
    content: `this am, caught the sunrise. Here's a poem about it if you care to read 🌅

The Rising

I watched the gray clouds turn fluorescent pink.
This is what sober must feel like.
There was a light coming from beneath the trees like a bulb starting to glow from its socket.
My expectations caused the electricity to quickly drain.
The clouds changed back to gray.
Who was I to demand the earth put on such a colorful show?
This, is what sober really feels like.
A fog began to rise and roll over the water like a smoke screen I've become so oddly accustomed to.
Eventually it dissipates.
The gentle ripples turn smooth and still, creating a mirror of the sky above, as if nature implied...don't be afraid. Look at yourself.`,
    likes: 3,
    comments: 0,
    timestamp: '2h ago',
    isLiked: false,
  },
  {
    id: '2',
    author: 'Sarah',
    content: `Day 15. The cravings hit different at night. But I'm learning that feelings are just visitors - they come, they go. Tonight I chose tea instead. Small victories.`,
    likes: 12,
    comments: 3,
    timestamp: '4h ago',
    isLiked: true,
  },
  {
    id: '3',
    author: 'Mike',
    content: `Anyone else notice how much clearer mornings are now? Like someone cleaned the windows of my mind. 30 days tomorrow. Still taking it one day at a time.`,
    likes: 24,
    comments: 7,
    timestamp: '1d ago',
    isLiked: false,
  },
];

export default function Community() {
  const router = useRouter();
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState(mockPosts);
  const [isWriting, setIsWriting] = useState(false);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handlePost = () => {
    if (newPost.trim()) {
      const newPostObj = {
        id: Date.now().toString(),
        author: getRandomAnonymousName(),
        content: newPost,
        likes: 0,
        comments: 0,
        timestamp: 'now',
        isLiked: false,
      };
      setPosts([newPostObj, ...posts]);
      setNewPost('');
      setIsWriting(false);
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
        <TouchableOpacity 
          style={styles.postInputContainer}
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
            <TouchableOpacity onPress={handlePost} style={styles.sendButton}>
              <Ionicons name="send" size={20} color="#4a90e2" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Posts */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.authorSection}>
                  <Ionicons name="person-circle" size={40} color="#4a90e2" />
                  <Text style={styles.authorName}>{post.author}</Text>
                </View>
                <Text style={styles.timestamp}>{post.timestamp}</Text>
              </View>
              
              <Text style={styles.postContent}>{post.content}</Text>
              
              <View style={styles.postActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleLike(post.id)}
                >
                  <Ionicons 
                    name={post.isLiked ? "heart" : "heart-outline"} 
                    size={24} 
                    color={post.isLiked ? "#ff4757" : "#999"} 
                  />
                  <Text style={styles.actionCount}>{post.likes}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="chatbubble-outline" size={24} color="#999" />
                  {post.comments > 0 && (
                    <Text style={styles.actionCount}>{post.comments}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}
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