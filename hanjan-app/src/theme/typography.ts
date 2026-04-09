import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'Pretendard-Variable',
  medium: 'Pretendard-Variable',
  semiBold: 'Pretendard-Variable',
  bold: 'Pretendard-Variable',
};

export const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

export const typography = {
  display: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    lineHeight: 36,
    fontFamily: fontFamily.bold,
  },
  h1: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
    lineHeight: 32,
    fontFamily: fontFamily.bold,
  },
  h2: {
    fontSize: 20,
    fontWeight: fontWeight.semiBold,
    lineHeight: 28,
    fontFamily: fontFamily.semiBold,
  },
  h3: {
    fontSize: 17,
    fontWeight: fontWeight.semiBold,
    lineHeight: 24,
    fontFamily: fontFamily.semiBold,
  },
  bodyL: {
    fontSize: 16,
    fontWeight: fontWeight.regular,
    lineHeight: 24,
    fontFamily: fontFamily.regular,
  },
  bodyM: {
    fontSize: 15,
    fontWeight: fontWeight.regular,
    lineHeight: 22,
    fontFamily: fontFamily.regular,
  },
  bodyS: {
    fontSize: 14,
    fontWeight: fontWeight.regular,
    lineHeight: 20,
    fontFamily: fontFamily.regular,
  },
  caption: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
    lineHeight: 16,
    fontFamily: fontFamily.medium,
  },
  overline: {
    fontSize: 11,
    fontWeight: fontWeight.semiBold,
    lineHeight: 14,
    fontFamily: fontFamily.semiBold,
  },
  buttonL: {
    fontSize: 16,
    fontWeight: fontWeight.semiBold,
    lineHeight: 20,
    fontFamily: fontFamily.semiBold,
  },
  buttonM: {
    fontSize: 14,
    fontWeight: fontWeight.semiBold,
    lineHeight: 18,
    fontFamily: fontFamily.semiBold,
  },
  buttonS: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
    lineHeight: 16,
    fontFamily: fontFamily.medium,
  },
} as const;

export type Typography = typeof typography;
