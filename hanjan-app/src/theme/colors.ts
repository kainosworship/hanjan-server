export const colors = {
  primary: {
    coral: '#FF6B52',
    dark: '#E8563F',
    light: '#FFE8E3',
  },
  secondary: {
    amber: '#FFB547',
    amberLight: '#FFF3DB',
  },
  neutral: {
    charcoal: '#1A1A2E',
    darkGray: '#4A4A68',
    mediumGray: '#8E8EA9',
    lightGray: '#E8E8F0',
    warmWhite: '#FFF8F5',
    pureWhite: '#FFFFFF',
  },
  semantic: {
    success: '#34C759',
    warning: '#FFCC00',
    error: '#FF3B30',
    info: '#007AFF',
  },
  category: {
    coffee: '#8B6914',
    coffeeBg: '#FFF3DB',
    meal: '#FF8C42',
    mealBg: '#FFE8D6',
    drink: '#D4A017',
    drinkBg: '#FFF8E1',
    walk: '#4CAF50',
    walkBg: '#E8F5E9',
    culture: '#9C27B0',
    cultureBg: '#F3E5F5',
    anything: '#FF6B9D',
    anythingBg: '#FFE4ED',
  },
} as const;

export type Colors = typeof colors;
