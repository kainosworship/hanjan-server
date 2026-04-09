import { ViewStyle } from 'react-native';
import { Platform } from 'react-native';

const shadow = (level: number): ViewStyle => {
  const shadows: Record<number, ViewStyle> = {
    0: {},
    1: Platform.select({
      ios: { shadowColor: '#1A1A2E', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3 },
      android: { elevation: 1 },
    }) || {},
    2: Platform.select({
      ios: { shadowColor: '#1A1A2E', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }) || {},
    3: Platform.select({
      ios: { shadowColor: '#1A1A2E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 16 },
      android: { elevation: 4 },
    }) || {},
    4: Platform.select({
      ios: { shadowColor: '#1A1A2E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.14, shadowRadius: 24 },
      android: { elevation: 8 },
    }) || {},
    5: Platform.select({
      ios: { shadowColor: '#1A1A2E', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.20, shadowRadius: 40 },
      android: { elevation: 16 },
    }) || {},
  };
  return shadows[level] || {};
};

export const shadows = {
  none: shadow(0),
  xs: shadow(1),
  sm: shadow(2),
  md: shadow(3),
  lg: shadow(4),
  xl: shadow(5),
} as const;

export type Shadows = typeof shadows;
