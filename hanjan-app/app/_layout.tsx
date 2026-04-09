import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});

export default function RootLayout() {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Pretendard-Variable': require('../src/assets/fonts/Pretendard-Variable.ttf'),
    })
      .then(() => {
        setFontsReady(true);
        SplashScreen.hideAsync();
      })
      .catch(() => {
        setFontsReady(true);
        SplashScreen.hideAsync();
      });
  }, []);

  if (!fontsReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="activity/[id]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="matching/[id]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="chat/[roomId]" />
            <Stack.Screen name="review/[meetingId]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="referral/index" />
            <Stack.Screen name="subscription/index" />
            <Stack.Screen name="safety/report" options={{ presentation: 'modal' }} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
