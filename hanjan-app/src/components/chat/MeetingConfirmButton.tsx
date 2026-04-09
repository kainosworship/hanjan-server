import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme';

interface Props {
  onConfirm: () => void;
  onDecline?: () => void;
  myConfirmed: boolean;
  partnerConfirmed: boolean;
  disabled?: boolean;
}

export function MeetingConfirmButton({ onConfirm, onDecline, myConfirmed, partnerConfirmed, disabled = false }: Props) {
  const bothConfirmed = myConfirmed && partnerConfirmed;

  return (
    <View style={styles.container}>
      {bothConfirmed ? (
        <View style={styles.confirmedBanner}>
          <Text style={styles.confirmedText}>🎉 만남이 확정되었어요!</Text>
        </View>
      ) : (
        <>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, myConfirmed && styles.statusDotActive]} />
              <Text style={styles.statusLabel}>나</Text>
            </View>
            <Text style={styles.statusSeparator}>·</Text>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, partnerConfirmed && styles.statusDotActive]} />
              <Text style={styles.statusLabel}>상대방</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            {onDecline && (
              <TouchableOpacity style={styles.declineButton} onPress={onDecline} disabled={disabled}>
                <Text style={styles.declineText}>다음에요 👋</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.confirmButton,
                myConfirmed && styles.confirmedButton,
                (disabled || myConfirmed) && styles.disabledButton,
              ]}
              onPress={onConfirm}
              disabled={disabled || myConfirmed}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>{myConfirmed ? '✓ 확정 완료' : '만남 확정하기 🤝'}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.pureWhite,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.lightGray,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  statusRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  statusItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.neutral.lightGray },
  statusDotActive: { backgroundColor: colors.semantic.success },
  statusLabel: { ...typography.caption, color: colors.neutral.mediumGray },
  statusSeparator: { ...typography.caption, color: colors.neutral.lightGray },
  buttonRow: { flexDirection: 'row', gap: spacing.sm },
  declineButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.neutral.lightGray,
    alignItems: 'center',
  },
  declineText: { ...typography.buttonM, color: colors.neutral.darkGray },
  confirmButton: {
    flex: 2,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.primary.coral,
    alignItems: 'center',
  },
  confirmedButton: { backgroundColor: colors.semantic.success },
  disabledButton: { opacity: 0.7 },
  confirmText: { ...typography.buttonM, color: colors.neutral.pureWhite },
  confirmedBanner: {
    backgroundColor: colors.semantic.success + '22',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.semantic.success + '44',
  },
  confirmedText: { ...typography.bodyM, color: colors.semantic.success, fontWeight: '700' },
});
