import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, radius, spacing } from '@/theme';

interface TagProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Tag({ label, selected = false, onPress, style }: TagProps) {
  return (
    <TouchableOpacity
      style={[styles.tag, selected && styles.selected, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1.5,
    borderColor: colors.neutral.lightGray,
    backgroundColor: colors.neutral.pureWhite,
  },
  selected: {
    borderColor: colors.primary.coral,
    backgroundColor: colors.primary.light,
  },
  text: { ...typography.buttonS, color: colors.neutral.darkGray },
  selectedText: { color: colors.primary.coral },
});
