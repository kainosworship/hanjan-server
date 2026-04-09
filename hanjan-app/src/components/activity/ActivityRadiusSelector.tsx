import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme';

const RADII = [
  { value: 1, label: '1km', description: '매우 가까운 거리' },
  { value: 2, label: '2km', description: '걸어서 25분 이내' },
  { value: 5, label: '5km', description: '이동 가능한 거리' },
];

interface Props {
  selected: 1 | 2 | 5;
  onSelect: (radius: 1 | 2 | 5) => void;
}

export function ActivityRadiusSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>반경 설정</Text>
      <View style={styles.row}>
        {RADII.map((r) => {
          const isSelected = selected === r.value;
          return (
            <TouchableOpacity
              key={r.value}
              style={[styles.item, isSelected && styles.selectedItem]}
              onPress={() => onSelect(r.value as 1 | 2 | 5)}
              activeOpacity={0.8}
            >
              <Text style={[styles.radiusLabel, isSelected && styles.selectedRadius]}>{r.label}</Text>
              <Text style={[styles.description, isSelected && styles.selectedDescription]}>{r.description}</Text>
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
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.neutral.lightGray,
  },
  selectedItem: { borderColor: colors.primary.coral, backgroundColor: colors.primary.light },
  radiusLabel: { ...typography.h3, color: colors.neutral.charcoal, marginBottom: 2 },
  selectedRadius: { color: colors.primary.coral },
  description: { ...typography.caption, color: colors.neutral.mediumGray, textAlign: 'center' },
  selectedDescription: { color: colors.primary.dark },
});
