export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  subscribersCount: number;
  isVerified: boolean;
}

export type Tier = 'free' | 'paid';

export interface Post {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string | null;
  coverUrl: string | null;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: Tier;
  createdAt: string;
}

export interface FeedResponse {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
}

export interface ApiError {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}
