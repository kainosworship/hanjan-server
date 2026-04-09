import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme';

const TIMES = [
  { id: 'now', label: '지금 즉시', emoji: '⚡' },
  { id: '30min', label: '30분 후', emoji: '⏰' },
  { id: '1hour', label: '1시간 후', emoji: '🕐' },
  { id: 'tonight', label: '오늘 저녁', emoji: '🌙' },
  { id: 'custom', label: '직접 입력', emoji: '✏️' },
];

interface Props {
  selected: string;
  onSelect: (timing: string) => void;
}

export function ActivityTimePicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>언제 만날까요?</Text>
      <View style={styles.list}>
        {TIMES.map((t) => {
          const isSelected = selected === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.item, isSelected && styles.selectedItem]}
              onPress={() => onSelect(t.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.emoji}>{t.emoji}</Text>
              <Text style={[styles.itemLabel, isSelected && styles.selectedLabel]}>{t.label}</Text>
              {isSelected && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing['2xl'] },
  label: { ...typography.h3, color: colors.neutral.charcoal, marginBottom: spacing.md },
  list: { gap: spacing.xs },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.neutral.lightGray,
  },
  selectedItem: { borderColor: colors.primary.coral, backgroundColor: colors.primary.light },
  emoji: { fontSize: 20 },
  itemLabel: { ...typography.bodyL, color: colors.neutral.darkGray, flex: 1 },
  selectedLabel: { color: colors.primary.coral, fontWeight: '600' },
  check: { color: colors.primary.coral, fontSize: 16, fontWeight: '700' },
});
