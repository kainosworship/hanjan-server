export const darkColors = {
  background: '#121220',
  card: '#1E1E32',
  text: '#F5F5FA',
  bodyText: '#C8C8DA',
  divider: '#2A2A42',
  primary: {
    coral: '#FF6B52',
    dark: '#E8563F',
    light: '#3A1A15',
  },
  secondary: {
    amber: '#FFB547',
    amberLight: '#2E2000',
  },
  neutral: {
    charcoal: '#F5F5FA',
    darkGray: '#C8C8DA',
    mediumGray: '#8E8EA9',
    lightGray: '#2A2A42',
    warmWhite: '#121220',
    pureWhite: '#1E1E32',
  },
  semantic: {
    success: '#34C759',
    warning: '#FFCC00',
    error: '#FF3B30',
    info: '#0A84FF',
  },
} as const;

export type DarkColors = typeof darkColors;
