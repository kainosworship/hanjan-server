export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

export type Radius = typeof radius;
