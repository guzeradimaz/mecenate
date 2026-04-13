export const colors = {
  // Brand
  primary: '#7C3AED',
  primaryLight: '#EDE9FE',
  primaryDark: '#5B21B6',

  // Background
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F4F6',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Status
  error: '#EF4444',
  errorLight: '#FEF2F2',
  success: '#10B981',
  warning: '#F59E0B',

  // UI
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  overlay: 'rgba(0,0,0,0.5)',
  locked: 'rgba(249,250,251,0.92)',

  // Like
  like: '#EF4444',
  likeInactive: '#9CA3AF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,

  // Line heights
  lineHeightSm: 18,
  lineHeightMd: 22,
  lineHeightLg: 26,

  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
};

export const avatarSize = {
  sm: 32,
  md: 40,
  lg: 48,
};
