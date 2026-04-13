import React, { useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike } from '../api/posts';
import { feedStore } from '../store/FeedStore';
import { FEED_QUERY_KEY } from '../hooks/useFeed';
import { Avatar } from './Avatar';
import { LockedBanner } from './LockedBanner';
import type { Post } from '../types';
import { colors, radius, shadows, spacing, typography } from '../tokens';

interface PostCardProps {
  post: Post;
}

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatCount = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
};

export const PostCard: React.FC<PostCardProps> = observer(({ post }) => {
  feedStore.initPost(post);

  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(post.id),
    onMutate: () => {
      feedStore.toggleLike(post.id);
    },
    onError: () => {
      feedStore.toggleLike(post.id); // revert
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEY });
    },
  });

  const handleLike = useCallback(() => {
    if (!likeMutation.isPending) {
      likeMutation.mutate();
    }
  }, [likeMutation]);

  const isLiked = feedStore.isLiked(post.id);
  const likesCount = feedStore.getLikesCount(post.id);

  return (
    <View style={styles.card}>
      {/* Author row */}
      <View style={styles.authorRow}>
        <Avatar uri={post.author.avatarUrl} displayName={post.author.displayName} size="md" />
        <View style={styles.authorInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName} numberOfLines={1}>
              {post.author.displayName}
            </Text>
            {post.author.isVerified && (
              <Text style={styles.verified}>✓</Text>
            )}
          </View>
          <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
        </View>
        {post.tier === 'paid' && (
          <View style={styles.paidBadge}>
            <Text style={styles.paidBadgeText}>Платно</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={3}>
        {post.title}
      </Text>

      {/* Cover image */}
      {post.coverUrl && (
        <Image source={{ uri: post.coverUrl }} style={styles.cover} resizeMode="cover" />
      )}

      {/* Body / Locked */}
      {post.tier === 'paid' ? (
        <LockedBanner />
      ) : (
        post.preview || post.body ? (
          <Text style={styles.preview} numberOfLines={4}>
            {post.preview || post.body}
          </Text>
        ) : null
      )}

      {/* Stats */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statBtn} onPress={handleLike} activeOpacity={0.7}>
          <Text style={[styles.statIcon, isLiked && styles.likedIcon]}>
            {isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.statText, isLiked && styles.likedText]}>
            {formatCount(likesCount)}
          </Text>
        </TouchableOpacity>
        <View style={styles.statBtn}>
          <Text style={styles.statIcon}>💬</Text>
          <Text style={styles.statText}>{formatCount(post.commentsCount)}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.card,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  authorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  displayName: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  verified: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.bold,
  },
  date: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  paidBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  paidBadgeText: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    color: colors.primary,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: typography.lineHeightLg,
  },
  cover: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceSecondary,
  },
  preview: {
    fontSize: typography.md,
    color: colors.textSecondary,
    lineHeight: typography.lineHeightMd,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  likedIcon: {},
  likedText: {
    color: colors.like,
    fontWeight: typography.semibold,
  },
});
