import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radius, shadows, spacing } from '../tokens';

const Shimmer: React.FC<{ style: object }> = ({ style }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);

  return <Animated.View style={[style, { opacity }]} />;
};

export const PostCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.authorRow}>
        <Shimmer style={styles.avatar} />
        <View style={styles.authorInfo}>
          <Shimmer style={styles.nameLine} />
          <Shimmer style={styles.dateLine} />
        </View>
      </View>
      <Shimmer style={styles.titleLine1} />
      <Shimmer style={styles.titleLine2} />
      <Shimmer style={styles.cover} />
      <Shimmer style={styles.textLine1} />
      <Shimmer style={styles.textLine2} />
    </View>
  );
};

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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.borderLight,
  },
  authorInfo: {
    flex: 1,
    gap: 6,
  },
  nameLine: {
    height: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.borderLight,
    width: '60%',
  },
  dateLine: {
    height: 11,
    borderRadius: radius.sm,
    backgroundColor: colors.borderLight,
    width: '35%',
  },
  titleLine1: {
    height: 18,
    borderRadius: radius.sm,
    backgroundColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  titleLine2: {
    height: 18,
    borderRadius: radius.sm,
    backgroundColor: colors.borderLight,
    width: '70%',
    marginBottom: spacing.md,
  },
  cover: {
    height: 180,
    borderRadius: radius.md,
    backgroundColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  textLine1: {
    height: 13,
    borderRadius: radius.sm,
    backgroundColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  textLine2: {
    height: 13,
    borderRadius: radius.sm,
    backgroundColor: colors.borderLight,
    width: '80%',
  },
});
