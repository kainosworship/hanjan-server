import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, radius, spacing } from '@/theme';

type BadgeVariant = 'primary' | 'amber' | 'success' | 'error' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'primary', style }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing['2xs'],
    alignSelf: 'flex-start',
  },
  primary: { backgroundColor: colors.primary.light },
  amber: { backgroundColor: colors.secondary.amberLight },
  success: { backgroundColor: '#E8F8EE' },
  error: { backgroundColor: '#FFE5E3' },
  neutral: { backgroundColor: colors.neutral.lightGray },
  text: { ...typography.overline },
  text_primary: { color: colors.primary.coral },
  text_amber: { color: colors.secondary.amber },
  text_success: { color: colors.semantic.success },
  text_error: { color: colors.semantic.error },
  text_neutral: { color: colors.neutral.mediumGray },
});
