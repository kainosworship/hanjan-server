import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.neutral.pureWhite,
          borderTopColor: colors.neutral.lightGray,
          borderTopWidth: 1,
          paddingBottom: insets.bottom,
          height: 49 + insets.bottom,
        },
        tabBarActiveTintColor: colors.primary.coral,
        tabBarInactiveTintColor: colors.neutral.mediumGray,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="map" options={{ title: '지도', tabBarIcon: () => null }} />
      <Tabs.Screen name="create" options={{ title: '활동', tabBarIcon: () => null }} />
      <Tabs.Screen name="chats" options={{ title: '채팅', tabBarIcon: () => null }} />
      <Tabs.Screen name="profile" options={{ title: '프로필', tabBarIcon: () => null }} />
    </Tabs>
  );
}
