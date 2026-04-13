import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, typography } from '../tokens';

export const LockedBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔒</Text>
      <Text style={styles.title}>Публикация для подписчиков</Text>
      <Text style={styles.subtitle}>Оформите подписку, чтобы читать полный текст</Text>
      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Поддержать автора</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.locked,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeightSm,
  },
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
  },
});
