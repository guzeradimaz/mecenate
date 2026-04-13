import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useMutation } from '@tanstack/react-query';
import { toggleLike } from '../api/posts';
import { feedStore } from '../store/FeedStore';
import { Avatar } from '../components/Avatar';
import type { Post } from '../types';
import { colors, layout, spacing, typography } from '../tokens';

const formatCount = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

// ─── Actions — isolated MobX observer ───────────────────────────────────────

interface ActionsProps {
  postId: string;
  commentsCount: number;
}

const DetailActions: React.FC<ActionsProps> = observer(({ postId, commentsCount }) => {
  const isLiked = feedStore.isLiked(postId);
  const likesCount = feedStore.getLikesCount(postId);
  const isPendingRef = useRef(false);

  const mutation = useMutation({
    mutationFn: () => toggleLike(postId),
    onMutate: () => feedStore.optimisticToggle(postId),
    onError: () => feedStore.optimisticToggle(postId),
    onSuccess: (data) => feedStore.applyLikeResult(postId, data),
  });

  isPendingRef.current = mutation.isPending;

  const handleLike = useCallback(() => {
    if (!isPendingRef.current) mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.buttons}>
      <TouchableOpacity
        style={[styles.actionBtn, isLiked && styles.actionBtnLiked]}
        onPress={handleLike}
        activeOpacity={0.8}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
      >
        <AntDesign
          name="heart"
          size={16}
          color={isLiked ? colors.likeActiveIcon : colors.textSecondary}
        />
        <Text style={[styles.count, isLiked && styles.countLiked]}>
          {formatCount(likesCount)}
        </Text>
      </TouchableOpacity>

      <View style={styles.actionBtn}>
        <Ionicons name="chatbubble-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.count}>{formatCount(commentsCount)}</Text>
      </View>
    </View>
  );
});

// ─── Screen ──────────────────────────────────────────────────────────────────

interface PostDetailScreenProps {
  post: Post;
  onBack: () => void;
}

export const PostDetailScreen: React.FC<PostDetailScreenProps> = memo(({ post, onBack }) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    feedStore.initPost(post);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPaid = post.tier === 'paid';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Avatar uri={post.author.avatarUrl} displayName={post.author.displayName} />
        <Text style={styles.authorName} numberOfLines={1}>
          {post.author.displayName}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      >
        {/* Cover image — full bleed */}
        {post.coverUrl ? (
          <Image
            source={{ uri: post.coverUrl }}
            style={styles.cover}
            contentFit="cover"
            cachePolicy="disk"
          />
        ) : null}

        <View style={styles.content}>
          {isPaid ? (
            <View style={styles.paidNote}>
              <Ionicons name="lock-closed" size={16} color={colors.textSecondary} />
              <Text style={styles.paidNoteText}>Контент доступен после доната</Text>
            </View>
          ) : (
            <>
              <Text style={styles.title}>{post.title}</Text>
              {post.body ? (
                <Text style={styles.body}>{post.body}</Text>
              ) : null}
            </>
          )}

          <DetailActions postId={post.id} commentsCount={post.commentsCount} />
        </View>
      </ScrollView>
    </View>
  );
});

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    flex: 1,
    fontSize: typography.authorName.fontSize,
    fontWeight: typography.authorName.fontWeight as '700',
    lineHeight: typography.authorName.lineHeight,
    color: colors.textPrimary,
    fontFamily: 'Manrope_700Bold',
  },
  cover: {
    width: '100%',
    aspectRatio: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight as '700',
    lineHeight: typography.title.lineHeight,
    color: colors.textPrimary,
    fontFamily: 'Manrope_700Bold',
  },
  body: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight as '500',
    lineHeight: typography.body.lineHeight,
    color: colors.textPrimary,
    fontFamily: 'Manrope_500Medium',
  },
  paidNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  paidNoteText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: 'Manrope_500Medium',
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.buttonBg,
    borderRadius: 9999,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 6,
    paddingRight: spacing.md,
    height: layout.buttonHeight,
  },
  actionBtnLiked: {
    backgroundColor: colors.likeActiveBg,
  },
  count: {
    fontSize: typography.count.fontSize,
    fontWeight: typography.count.fontWeight as '700',
    lineHeight: typography.count.lineHeight,
    color: colors.textSecondary,
    fontFamily: 'Manrope_700Bold',
  },
  countLiked: {
    color: colors.likeActiveText,
  },
});
