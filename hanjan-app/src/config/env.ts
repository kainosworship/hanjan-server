export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000',
  KAKAO_MAP_KEY: process.env.EXPO_PUBLIC_KAKAO_MAP_KEY || '',
  REVENUECAT_IOS_KEY: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS || '',
  REVENUECAT_ANDROID_KEY: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID || '',
  APP_SCHEME: process.env.EXPO_PUBLIC_APP_SCHEME || 'hanjan',
  WEB_URL: process.env.EXPO_PUBLIC_WEB_URL || 'https://hanjan.app',
} as const;
