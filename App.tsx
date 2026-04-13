import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { FeedScreen } from './src/screens/FeedScreen';
import { colors } from './src/tokens';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
    },
  },
});

const AppContent: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: colors.background }}>
      <StatusBar style="dark" />
      <FeedScreen />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
