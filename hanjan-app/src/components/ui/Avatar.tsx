import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { colors, radius } from '@/theme';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  imageUrl?: string;
  nickname?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

const SIZES: Record<AvatarSize, number> = { sm: 32, md: 44, lg: 56, xl: 80 };

export function Avatar({ imageUrl, nickname, size = 'md', style }: AvatarProps) {
  const dimension = SIZES[size];
  const fontSize = dimension * 0.4;

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={{ width: dimension, height: dimension, borderRadius: dimension / 2 } as ImageStyle}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: dimension, height: dimension, borderRadius: dimension / 2 },
        style,
      ]}
    >
      <Text style={{ fontSize, color: colors.neutral.pureWhite, fontWeight: '700' }}>
        {nickname ? nickname.charAt(0) : '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.primary.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
