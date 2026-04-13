import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFeed } from '../hooks/useFeed';
import { PostCard } from '../components/PostCard';
import { PostCardSkeleton } from '../components/PostCardSkeleton';
import type { Post } from '../types';
import { colors, spacing } from '../tokens';

const SKELETONS = [0, 1, 2];
const keyExtractor = (item: Post) => item.id;
const REFRESH_COLORS = [colors.primary]; // stable reference, avoids new array each render

interface FeedScreenProps {
  onPostPress: (post: Post) => void;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({ onPostPress }) => {
  const insets = useSafeAreaInsets();

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useFeed();

  const posts = useMemo(
    () => data?.pages.flatMap((p) => p.posts) ?? [],
    [data],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefetch = useCallback(() => refetch(), [refetch]);

  // onPostPress (from App) is stable → PostCard.memo correctly skips re-renders on pagination
  const renderItem = useCallback(({ item }: { item: Post }) => (
    <PostCard post={item} onPress={onPostPress} />
  ), [onPostPress]);

  // edgeToEdgeEnabled: true in app.json — last items would be hidden under Android nav bar
  const listContentStyle = useMemo(() => ({
    padding: spacing.lg,
    paddingBottom: insets.bottom + spacing.lg,
  }), [insets.bottom]);

  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={isRefetching && !isFetchingNextPage}
      onRefresh={handleRefetch}
      tintColor={colors.primary}
      colors={REFRESH_COLORS}
    />
  ), [isRefetching, isFetchingNextPage, handleRefetch]);

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.skeletonList}>
          {SKELETONS.map((i) => <PostCardSkeleton key={i} />)}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorCard}>
          <View style={styles.illustrationWrap}>
            <Text style={styles.illustration}>🥺</Text>
          </View>
          <Text style={styles.errorTitle}>Не удалось загрузить публикации</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={handleRefetch}
            activeOpacity={0.85}
          >
            <Text style={styles.retryText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshControl={refreshControl}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        contentContainerStyle={listContentStyle}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skeletonList: {
    padding: spacing.lg,
  },
  footer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },

  // ─── Error state ─────────────────────────────────────────────────────────
  errorCard: {
    margin: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    gap: spacing.lg,
  },
  illustrationWrap: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    fontSize: 76,
    lineHeight: 90,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    fontFamily: 'Manrope_700Bold',
    lineHeight: 24,
  },
  retryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 42,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Manrope_600SemiBold',
  },
});
