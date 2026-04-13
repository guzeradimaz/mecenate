import { apiClient } from './client';
import type { ApiResponse, FeedResponse, LikeData, Post } from '../types';

export const fetchFeed = async (cursor?: string | null): Promise<FeedResponse> => {
  const params: Record<string, string | number> = { limit: 10 };
  if (cursor) params.cursor = cursor;

  const response = await apiClient.get<ApiResponse<FeedResponse>>('/posts', { params });
  return response.data.data;
};

export const fetchPost = async (id: string): Promise<Post> => {
  const response = await apiClient.get<ApiResponse<{ post: Post }>>(`/posts/${id}`);
  return response.data.data.post;
};

export const toggleLike = async (id: string): Promise<LikeData> => {
  const response = await apiClient.post<ApiResponse<LikeData>>(`/posts/${id}/like`);
  return response.data.data;
};
