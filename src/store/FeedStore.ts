import { makeAutoObservable, runInAction } from 'mobx';
import type { Post } from '../types';

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
    if (post.isLiked && !this.likedPosts.has(post.id)) {
      this.likedPosts.add(post.id);
    }
  }

  toggleLike(postId: string) {
    const currentCount = this.likesCounts.get(postId) ?? 0;
    if (this.likedPosts.has(postId)) {
      runInAction(() => {
        this.likedPosts.delete(postId);
        this.likesCounts.set(postId, Math.max(0, currentCount - 1));
      });
    } else {
      runInAction(() => {
        this.likedPosts.add(postId);
        this.likesCounts.set(postId, currentCount + 1);
      });
    }
  }

  isLiked(postId: string): boolean {
    return this.likedPosts.has(postId);
  }

  getLikesCount(postId: string): number {
    return this.likesCounts.get(postId) ?? 0;
  }
}

export const feedStore = new FeedStore();
