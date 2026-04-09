import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme';

const SIZES = [
  { id: '1:1', label: '1:1', description: '단둘이', emoji: '👫' },
  { id: '2:2', label: '2:2', description: '친구랑', emoji: '👫👫' },
  { id: 'group', label: '소그룹', description: '3~6명', emoji: '👥' },
];

interface Props {
  selected: string;
  onSelect: (size: string) => void;
}

export function ActivityGroupSizeSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>몇 명이서?</Text>
      <View style={styles.row}>
        {SIZES.map((s) => {
          const isSelected = selected === s.id;
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.item, isSelected && styles.selectedItem]}
              onPress={() => onSelect(s.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.emoji}>{s.emoji}</Text>
              <Text style={[styles.sizeLabel, isSelected && styles.selectedLabel]}>{s.label}</Text>
              <Text style={[styles.description, isSelected && styles.selectedDescription]}>{s.description}</Text>
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
  row: { flexDirection: 'row', gap: spacing.sm },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.neutral.lightGray,
    gap: spacing['2xs'],
  },
  selectedItem: { borderColor: colors.primary.coral, backgroundColor: colors.primary.light },
  emoji: { fontSize: 24 },
  sizeLabel: { ...typography.bodyM, color: colors.neutral.charcoal, fontWeight: '600' },
  selectedLabel: { color: colors.primary.coral },
  description: { ...typography.caption, color: colors.neutral.mediumGray },
  selectedDescription: { color: colors.primary.dark },
});
