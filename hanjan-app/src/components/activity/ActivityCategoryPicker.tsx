import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme';

const CATEGORIES = [
  { id: 'coffee', emoji: '☕', label: '커피 한잔', color: colors.category.coffee, bg: colors.category.coffeeBg },
  { id: 'meal', emoji: '🍽️', label: '같이 밥', color: colors.category.meal, bg: colors.category.mealBg },
  { id: 'drink', emoji: '🍺', label: '한잔 하자', color: colors.category.drink, bg: colors.category.drinkBg },
  { id: 'walk', emoji: '🚶', label: '산책/운동', color: colors.category.walk, bg: colors.category.walkBg },
  { id: 'culture', emoji: '🎨', label: '문화생활', color: colors.category.culture, bg: colors.category.cultureBg },
  { id: 'anything', emoji: '🎲', label: '뭐든 좋아', color: colors.category.anything, bg: colors.category.anythingBg },
];

interface Props {
  selected: string;
  onSelect: (category: string) => void;
}

export function ActivityCategoryPicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>어떤 활동인가요?</Text>
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.item,
                { backgroundColor: isSelected ? cat.color : cat.bg },
                isSelected && styles.selectedItem,
              ]}
              onPress={() => onSelect(cat.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.emoji}>{cat.emoji}</Text>
              <Text style={[styles.itemLabel, { color: isSelected ? colors.neutral.pureWhite : cat.color }]}>
                {cat.label}
              </Text>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  item: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selectedItem: { borderColor: 'rgba(255,255,255,0.4)' },
  emoji: { fontSize: 22 },
  itemLabel: { ...typography.bodyM, fontWeight: '600', flex: 1 },
});
