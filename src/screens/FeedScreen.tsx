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
import { useFeed } from '../hooks/useFeed';
import { PostCard } from '../components/PostCard';
import { PostCardSkeleton } from '../components/PostCardSkeleton';
import type { Post } from '../types';
import { colors, spacing, typography } from '../tokens';

const SKELETONS = Array.from({ length: 4 }, (_, i) => `skeleton-${i}`);

export const FeedScreen: React.FC = () => {
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
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => <PostCard post={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const ListFooter = useMemo(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isFetchingNextPage]);

  const ListEmpty = useMemo(() => {
    if (isLoading) {
      return (
        <View>
          {SKELETONS.map((k) => (
            <PostCardSkeleton key={k} />
          ))}
        </View>
      );
    }
    if (isError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Не удалось загрузить публикации</Text>
          <Text style={styles.errorSubtitle}>Проверьте интернет-соединение и попробуйте снова</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()} activeOpacity={0.8}>
            <Text style={styles.retryText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.emptyText}>Публикаций пока нет</Text>
      </View>
    );
  }, [isLoading, isError, refetch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Лента</Text>
      </View>
      <FlatList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
  footer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingTop: 80,
    gap: spacing.md,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  errorTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeightSm,
  },
  retryButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: 50,
  },
  retryText: {
    color: colors.textInverse,
    fontSize: typography.md,
    fontWeight: typography.semibold,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: spacing.md,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
});
