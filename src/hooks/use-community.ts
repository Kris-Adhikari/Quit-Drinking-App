import { useState, useEffect, useCallback } from 'react';
import { Post } from '@/types/community';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { communityPosts } from '@/data/community-posts';

// List of common first names for anonymous users
const anonymousNames = [
  'Alex', 'Sam', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Jamie', 'Robin',
  'Sarah', 'Mike', 'Emma', 'Chris', 'Lisa', 'David', 'Amy', 'Ryan',
  'Kelly', 'Pat', 'Lee', 'Dana', 'Blake', 'Drew', 'Quinn', 'Reese'
];

const getRandomAnonymousName = () => {
  return anonymousNames[Math.floor(Math.random() * anonymousNames.length)];
};

// Fake supportive responses to make users feel heard
const supportiveResponses = [
  "Thank you for sharing this. You're not alone in this journey. 💙",
  "Your honesty is inspiring. Keep taking it one day at a time! 🌟",
  "I really felt this. Sending you strength and support. 🤗",
  "This resonates so much. We're all here supporting each other. ❤️",
  "Your courage to share helps others feel less alone. Thank you. 🙏",
  "Every small step forward is a victory. You're doing great! 💪",
  "I needed to read this today. Thank you for your vulnerability. 🌈",
  "Your words remind me why this community is so special. Keep going! ✨",
  "Feeling this deeply. You've got this, and we've got your back. 💫",
  "Your strength shows through your words. Proud of you! 🌻"
];


export const useCommunity = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load posts
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use local storage for all posts
      const saved = await AsyncStorage.getItem('communityPosts');
      if (saved) {
        setPosts(JSON.parse(saved));
      } else {
        setPosts(communityPosts);
        await AsyncStorage.setItem('communityPosts', JSON.stringify(communityPosts));
      }
      
      // Load user likes
      const savedLikes = await AsyncStorage.getItem('userLikes');
      if (savedLikes) {
        setUserLikes(new Set(JSON.parse(savedLikes)));
      }
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create post
  const createPost = async (content: string, isAnonymous: boolean = false): Promise<boolean> => {
    if (!content.trim()) return false;

    try {
      const authorName = getRandomAnonymousName();
      
      // Always use local storage - no Supabase needed
      const newPost: Post = {
        id: Date.now().toString(),
        user_id: 'local-user',
        content: content.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        likes_count: 0,
        comments_count: 0,
        is_anonymous: true,
        author_name: authorName,
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      await AsyncStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
      
      // Add a fake response after a delay to make it feel real
      setTimeout(async () => {
        const response = supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
        const responseAuthor = getRandomAnonymousName();
        
        const fakeResponse: Post = {
          id: (Date.now() + Math.random() * 1000).toString(),
          user_id: 'fake-user',
          content: response,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          likes_count: Math.floor(Math.random() * 5) + 1, // 1-5 likes
          comments_count: 0,
          is_anonymous: true,
          author_name: responseAuthor,
        };

        // Update both state and storage
        setPosts(currentPosts => {
          const updatedPosts = [fakeResponse, ...currentPosts];
          AsyncStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
          return updatedPosts;
        });
      }, Math.random() * 30000 + 10000); // 10-40 seconds delay
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      console.error('Error creating post:', err);
      return false;
    }
  };

  // Toggle like
  const toggleLike = async (postId: string): Promise<boolean> => {

    try {
      const isLiked = userLikes.has(postId);

      // Local like toggle
      const updatedLikes = new Set(userLikes);
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          if (isLiked) {
            updatedLikes.delete(postId);
            return { ...post, likes_count: Math.max(0, post.likes_count - 1) };
          } else {
            updatedLikes.add(postId);
            return { ...post, likes_count: post.likes_count + 1 };
          }
        }
        return post;
      });

      setUserLikes(updatedLikes);
      setPosts(updatedPosts);
      
      await AsyncStorage.setItem('userLikes', JSON.stringify([...updatedLikes]));
      await AsyncStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle like');
      console.error('Error toggling like:', err);
      return false;
    }
  };

  // Check if user has liked a post
  const isPostLiked = (postId: string): boolean => {
    return userLikes.has(postId);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now.getTime() - postTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return postTime.toLocaleDateString();
  };

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return {
    posts,
    loading,
    error,
    createPost,
    toggleLike,
    isPostLiked,
    formatTimestamp,
    loadPosts,
  };
};