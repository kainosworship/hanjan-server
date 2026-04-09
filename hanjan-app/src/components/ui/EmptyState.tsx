import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing } from '@/theme';
import { Button } from './Button';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({ emoji, title, subtitle, actionLabel, onAction, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: spacing['3xl'] },
  emoji: { fontSize: 48, marginBottom: spacing.lg },
  title: { ...typography.h3, color: colors.neutral.charcoal, textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { ...typography.bodyM, color: colors.neutral.mediumGray, textAlign: 'center', marginBottom: spacing.xl },
  action: { width: '100%' },
});
