import { makeAutoObservable, runInAction } from 'mobx';
import type { LikeData, Post } from '../types';

class FeedStore {
  likedPosts: Set<string> = new Set();
  likesCounts: Map<string, number> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  initPost(post: Post) {
    if (!this.likesCounts.has(post.id)) {
      this.likesCounts.set(post.id, post.likesCount);
    }
    if (post.isLiked) {
      this.likedPosts.add(post.id);
    }
  }

  // Optimistic: toggle locally before server confirms
  optimisticToggle(postId: string) {
    const currentCount = this.likesCounts.get(postId) ?? 0;
    runInAction(() => {
      if (this.likedPosts.has(postId)) {
        this.likedPosts.delete(postId);
        this.likesCounts.set(postId, Math.max(0, currentCount - 1));
      } else {
        this.likedPosts.add(postId);
        this.likesCounts.set(postId, currentCount + 1);
      }
    });
  }

  // Apply authoritative server response
  applyLikeResult(postId: string, data: LikeData) {
    runInAction(() => {
      if (data.isLiked) {
        this.likedPosts.add(postId);
      } else {
        this.likedPosts.delete(postId);
      }
      this.likesCounts.set(postId, data.likesCount);
    });
  }

  isLiked(postId: string): boolean {
    return this.likedPosts.has(postId);
  }

  getLikesCount(postId: string): number {
    return this.likesCounts.get(postId) ?? 0;
  }
}

export const feedStore = new FeedStore();
