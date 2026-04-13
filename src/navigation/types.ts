import type { Post } from '../types';

// Props for screens using state-based navigation
export interface FeedScreenProps {
  onPostPress: (post: Post) => void;
}

export interface PostDetailScreenProps {
  post: Post;
  onBack: () => void;
}
