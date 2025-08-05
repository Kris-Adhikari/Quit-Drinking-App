export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  is_anonymous: boolean;
  author_name?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  is_anonymous: boolean;
  author_name?: string;
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface CommunityUser {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
}