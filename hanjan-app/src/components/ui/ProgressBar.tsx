import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '@/theme';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({ progress, color = colors.primary.coral, height = 8, style }: ProgressBarProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.track, { height }, style]}>
      <View
        style={[
          styles.fill,
          { width: `${clampedProgress * 100}%`, backgroundColor: color, height },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.neutral.lightGray,
    borderRadius: radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: radius.full,
  },
});
