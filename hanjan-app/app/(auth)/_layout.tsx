import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="phone-verify" />
      <Stack.Screen name="id-verify" />
      <Stack.Screen name="selfie" />
      <Stack.Screen name="profile-setup" />
      <Stack.Screen name="permissions" />
    </Stack>
  );
}
