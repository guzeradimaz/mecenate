import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useMutation } from '@tanstack/react-query';
import { toggleLike } from '../api/posts';
import { feedStore } from '../store/FeedStore';
import { Avatar } from './Avatar';
import type { Post } from '../types';
import { colors, layout, spacing, typography } from '../tokens';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatCount = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

// ─── PostCardActions — only this re-renders on like state changes ────────────

interface ActionsProps {
  postId: string;
  commentsCount: number;
}

const PostCardActions: React.FC<ActionsProps> = observer(({ postId, commentsCount }) => {
  const isLiked = feedStore.isLiked(postId);
  const likesCount = feedStore.getLikesCount(postId);

  const mutation = useMutation({
    mutationFn: () => toggleLike(postId),
    onMutate: () => feedStore.optimisticToggle(postId),
    onError: () => feedStore.optimisticToggle(postId),
    onSuccess: (data) => feedStore.applyLikeResult(postId, data),
  });

  // Stable ref so handleLike closure doesn't change on every mutation state update
  const isPendingRef = useRef(false);
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

// ─── PaidOverlay — static, no state ─────────────────────────────────────────

const PaidOverlay: React.FC = memo(() => (
  <View style={styles.overlay}>
    <View style={styles.paidContent}>
      <View style={styles.paidIconWrap}>
        <Ionicons name="cash-outline" size={20} color={colors.textInverse} />
      </View>
      <Text style={styles.paidText}>
        {'Контент скрыт пользователем.\nДоступ откроется после доната'}
      </Text>
      <TouchableOpacity style={styles.donateBtn} activeOpacity={0.85}>
        <Text style={styles.donateBtnText}>Отправить донат</Text>
      </TouchableOpacity>
    </View>
  </View>
));

// ─── PostCard ────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: Post;
  onPress?: (post: Post) => void;
}

// memo prevents re-render when parent list re-renders (e.g. pagination)
// Observer is NOT used here — MobX reactivity is isolated to PostCardActions
export const PostCard: React.FC<PostCardProps> = memo(({ post, onPress }) => {
  const [expanded, setExpanded] = useState(false);

  // Initialize store once on mount; safe side-effect outside render
  useEffect(() => {
    feedStore.initPost(post);
    // intentionally omit post from deps — only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stable press handler — onPress and post refs are both stable,
  // so this callback reference won't change between renders → memo works correctly
  const handlePress = useCallback(() => {
    onPress?.(post);
  }, [onPress, post]);

  const isPaid = post.tier === 'paid';
  const bodyText = post.preview || post.body;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={onPress ? 0.92 : 1}
      style={styles.card}
    >
      {/* Author row */}
      <View style={styles.authorRow}>
        <Avatar uri={post.author.avatarUrl} displayName={post.author.displayName} />
        <Text style={styles.authorName} numberOfLines={1}>
          {post.author.displayName}
        </Text>
      </View>

      {/* Cover image — full bleed */}
      <View style={styles.imageWrap}>
        {post.coverUrl ? (
          <Image
            source={{ uri: post.coverUrl }}
            style={styles.image}
            contentFit="cover"
            cachePolicy="disk"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
        {isPaid && <PaidOverlay />}
      </View>

      {/* Content */}
      {isPaid ? (
        <View style={styles.skeletonBlock}>
          <View style={[styles.skeletonLine, styles.skeletonShort]} />
          <View style={[styles.skeletonLine, styles.skeletonFull]} />
        </View>
      ) : (
        <>
          <Text style={styles.title}>{post.title}</Text>

          {bodyText ? (
            <>
              <Text
                style={styles.body}
                numberOfLines={expanded ? undefined : 2}
              >
                {bodyText}
              </Text>
              {!expanded && bodyText.length > 80 && (
                <TouchableOpacity
                  onPress={() => setExpanded(true)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                >
                  <Text style={styles.showMoreText}>Показать еще</Text>
                </TouchableOpacity>
              )}
            </>
          ) : null}

          <PostCardActions postId={post.id} commentsCount={post.commentsCount} />
        </>
      )}
    </TouchableOpacity>
  );
});

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    paddingHorizontal: layout.cardPaddingH,
    paddingTop: layout.cardPaddingV,
    paddingBottom: layout.cardPaddingV,
    marginBottom: layout.cardGap,
  },

  // Author
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: layout.cardGap,
  },
  authorName: {
    flex: 1,
    fontSize: typography.authorName.fontSize,
    fontWeight: typography.authorName.fontWeight as '700',
    lineHeight: typography.authorName.lineHeight,
    color: colors.textPrimary,
    fontFamily: 'Manrope_700Bold',
  },

  // Image
  imageWrap: {
    marginHorizontal: -layout.cardPaddingH,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.skeletonBg,
  },
  imagePlaceholder: {
    backgroundColor: colors.skeletonBg,
  },

  // Text
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight as '700',
    lineHeight: typography.title.lineHeight,
    color: colors.textPrimary,
    fontFamily: 'Manrope_700Bold',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight as '500',
    lineHeight: typography.body.lineHeight,
    color: colors.textPrimary,
    fontFamily: 'Manrope_500Medium',
  },
  showMoreText: {
    marginTop: 2,
    fontSize: typography.showMore.fontSize,
    fontWeight: typography.showMore.fontWeight as '500',
    lineHeight: typography.showMore.lineHeight,
    color: colors.primary,
    fontFamily: 'Manrope_500Medium',
  },

  // Action buttons
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: layout.cardGap,
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

  // Paid overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidContent: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  paidIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.textInverse,
    textAlign: 'center',
    fontFamily: 'Manrope_600SemiBold',
  },
  donateBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: layout.cardGap,
  },
  donateBtnText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 26,
    color: colors.textInverse,
    fontFamily: 'Manrope_600SemiBold',
  },

  // Paid skeleton
  skeletonBlock: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  skeletonLine: {
    backgroundColor: colors.skeletonBg,
    borderRadius: 22,
  },
  skeletonShort: {
    height: 26,
    width: '45%',
  },
  skeletonFull: {
    height: 40,
    width: '100%',
  },
});
