import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/colors';

export default function Index() {
  const router = useRouter();
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize().then(() => {
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      if (isAuthenticated) {
        router.replace('/(tabs)/map');
      } else {
        router.replace('/(auth)/welcome');
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.neutral.warmWhite }}>
      <ActivityIndicator size="large" color={colors.primary.coral} />
    </View>
  );
}
