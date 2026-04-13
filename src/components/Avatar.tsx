import React, { memo } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { colors, layout } from '../tokens';

interface AvatarProps {
  uri: string | null;
  displayName: string;
}

export const Avatar: React.FC<AvatarProps> = memo(({ uri, displayName }) => {
  const size = layout.avatarSize;
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.34 }]}>{initials}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    overflow: 'hidden',
  },
  initials: {
    color: colors.primary,
    fontWeight: '700',
    fontFamily: 'Manrope_700Bold',
  },
});
