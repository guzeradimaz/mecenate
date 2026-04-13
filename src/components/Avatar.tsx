import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { avatarSize, colors, radius, typography } from '../tokens';

interface AvatarProps {
  uri: string | null;
  displayName: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ uri, displayName, size = 'md' }) => {
  const dim = avatarSize[size];
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.container, { width: dim, height: dim, borderRadius: dim / 2 }]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: dim, height: dim, borderRadius: dim / 2 }]}
        />
      ) : (
        <Text style={[styles.initials, { fontSize: dim * 0.38 }]}>{initials}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    color: colors.primary,
    fontWeight: typography.semibold,
  },
});
