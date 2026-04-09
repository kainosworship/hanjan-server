import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme';

interface Props {
  seconds: number;
  isWarning: boolean;
  isUrgent: boolean;
  isExpired: boolean;
}

export function ChatTimer({ seconds, isWarning, isUrgent, isExpired }: Props) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${minutes}:${secs.toString().padStart(2, '0')}`;

  const bgColor = isExpired || isUrgent
    ? colors.semantic.error
    : isWarning
    ? colors.semantic.warning
    : colors.secondary.amber;

  const textColor = isExpired || isUrgent
    ? colors.neutral.pureWhite
    : isWarning
    ? colors.neutral.charcoal
    : colors.neutral.charcoal;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.icon]}>⏱️</Text>
      <Text style={[styles.time, { color: textColor }]}>
        {isExpired ? '시간 초과' : timeStr}
      </Text>
      {isUrgent && !isExpired && (
        <View style={styles.urgentBadge}>
          <Text style={styles.urgentText}>긴급</Text>
        </View>
      )}
      {isWarning && !isUrgent && (
        <Text style={styles.warningText}>곧 종료!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  icon: { fontSize: 14 },
  time: { ...typography.bodyM, fontWeight: '700', fontVariant: ['tabular-nums'] },
  urgentBadge: {
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
  },
  urgentText: { fontSize: 10, color: colors.semantic.error, fontWeight: '700' },
  warningText: { fontSize: 11, color: colors.neutral.charcoal, fontWeight: '600' },
});
