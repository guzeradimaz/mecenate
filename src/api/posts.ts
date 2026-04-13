import { apiClient } from './client';
import type { ApiResponse, FeedResponse, Post } from '../types';

export const fetchFeed = async (cursor?: string | null): Promise<FeedResponse> => {
  const params: Record<string, string | number> = { limit: 10 };
  if (cursor) params.cursor = cursor;

  const response = await apiClient.get<ApiResponse<FeedResponse>>('/posts', { params });
  return response.data.data;
};

export const fetchPost = async (id: string): Promise<Post> => {
  const response = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
  return response.data.data;
};

export const toggleLike = async (id: string): Promise<void> => {
  await apiClient.post(`/posts/${id}/like`);
};
