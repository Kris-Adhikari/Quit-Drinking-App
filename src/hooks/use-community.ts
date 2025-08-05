import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { Post, Comment, Like } from '@/types/community';
import AsyncStorage from '@react-native-async-storage/async-storage';

// List of common first names for anonymous users
const anonymousNames = [
  'Alex', 'Sam', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Jamie', 'Robin',
  'Sarah', 'Mike', 'Emma', 'Chris', 'Lisa', 'David', 'Amy', 'Ryan',
  'Kelly', 'Pat', 'Lee', 'Dana', 'Blake', 'Drew', 'Quinn', 'Reese'
];

const getRandomAnonymousName = () => {
  return anonymousNames[Math.floor(Math.random() * anonymousNames.length)];
};

// Mock posts for development without Supabase
const mockPosts: Post[] = [
  {
    id: '1',
    user_id: 'mock-user-1',
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
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes_count: 3,
    comments_count: 0,
    is_anonymous: true,
    author_name: 'Anonymous',
  },
  {
    id: '2',
    user_id: 'mock-user-2',
    content: `Day 15. The cravings hit different at night. But I'm learning that feelings are just visitors - they come, they go. Tonight I chose tea instead. Small victories.`,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes_count: 12,
    comments_count: 3,
    is_anonymous: false,
    author_name: 'Sarah',
  },
  {
    id: '3',
    user_id: 'mock-user-3',
    content: `Anyone else notice how much clearer mornings are now? Like someone cleaned the windows of my mind. 30 days tomorrow. Still taking it one day at a time.`,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likes_count: 24,
    comments_count: 7,
    is_anonymous: false,
    author_name: 'Mike',
  },
];

export const useCommunity = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSupabaseConfigured = false; // Disabled for now - will enable when tables are created

  // Load posts
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured) {
        // Use mock data for development
        const saved = await AsyncStorage.getItem('communityPosts');
        if (saved) {
          setPosts(JSON.parse(saved));
        } else {
          setPosts(mockPosts);
          await AsyncStorage.setItem('communityPosts', JSON.stringify(mockPosts));
        }
        
        // Load user likes
        const savedLikes = await AsyncStorage.getItem('userLikes');
        if (savedLikes) {
          setUserLikes(new Set(JSON.parse(savedLikes)));
        }
        
        setLoading(false);
        return;
      }

      // Real Supabase query
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Load user likes
      if (user) {
        const { data: likesData, error: likesError } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id);

        if (likesError) throw likesError;
        
        setUserLikes(new Set(likesData?.map(like => like.post_id) || []));
      }

      setPosts(postsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  }, [user, isSupabaseConfigured]);

  // Create post
  const createPost = async (content: string, isAnonymous: boolean = false): Promise<boolean> => {
    if (!user || !content.trim()) return false;

    try {
      const authorName = isAnonymous ? getRandomAnonymousName() : user.email?.split('@')[0] || 'User';
      
      if (!isSupabaseConfigured) {
        // Mock post creation
        const newPost: Post = {
          id: Date.now().toString(),
          user_id: user.id,
          content: content.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          likes_count: 0,
          comments_count: 0,
          is_anonymous: isAnonymous,
          author_name: authorName,
        };

        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        await AsyncStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
        return true;
      }

      // Real Supabase insert
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: content.trim(),
          is_anonymous: isAnonymous,
          author_name: authorName,
        });

      if (error) throw error;

      await loadPosts(); // Reload posts
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      console.error('Error creating post:', err);
      return false;
    }
  };

  // Toggle like
  const toggleLike = async (postId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const isLiked = userLikes.has(postId);

      if (!isSupabaseConfigured) {
        // Mock like toggle
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
      }

      // Real Supabase like toggle
      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id });

        if (error) throw error;
      }

      await loadPosts(); // Reload posts
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