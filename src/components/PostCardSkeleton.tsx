import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, layout, spacing } from '../tokens';

const Shimmer: React.FC<{ style: object }> = ({ style }) => {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 750, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[{ backgroundColor: colors.skeletonBg }, style, { opacity }]} />
  );
};

export const PostCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      {/* Author row */}
      <View style={styles.authorRow}>
        <Shimmer style={styles.avatar} />
        <Shimmer style={styles.nameLine} />
      </View>

      {/* Image */}
      <View style={styles.imageWrap}>
        <Shimmer style={styles.image} />
      </View>

      {/* Text */}
      <Shimmer style={styles.titleLine} />
      <Shimmer style={styles.bodyLine} />
    </View>
  );
};

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
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: layout.cardGap,
  },
  avatar: {
    width: layout.avatarSize,
    height: layout.avatarSize,
    borderRadius: layout.avatarSize / 2,
  },
  nameLine: {
    height: 16,
    width: 120,
    borderRadius: 8,
  },
  imageWrap: {
    marginHorizontal: -layout.cardPaddingH,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  titleLine: {
    height: 22,
    borderRadius: 8,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    width: '80%',
  },
  bodyLine: {
    height: 40,
    borderRadius: 8,
  },
});
