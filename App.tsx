import React, { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import {
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { FeedScreen } from './src/screens/FeedScreen';
import { PostDetailScreen } from './src/screens/PostDetailScreen';
import { colors } from './src/tokens';
import type { Post } from './src/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30_000 },
  },
});

const AppNavigator: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handlePostPress = useCallback((post: Post) => setSelectedPost(post), []);
  const handleBack = useCallback(() => setSelectedPost(null), []);

  if (selectedPost) {
    return <PostDetailScreen post={selectedPost} onBack={handleBack} />;
  }
  return <FeedScreen onPostPress={handlePostPress} />;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <AppNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
