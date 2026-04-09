import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from '@/theme';

const CATEGORY_META: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
  COFFEE: { emoji: '☕', label: '커피', color: colors.category.coffee, bg: colors.category.coffeeBg },
  MEAL: { emoji: '🍽️', label: '밥', color: colors.category.meal, bg: colors.category.mealBg },
  DRINK: { emoji: '🍺', label: '한잔', color: colors.category.drink, bg: colors.category.drinkBg },
  WALK: { emoji: '🚶', label: '산책', color: colors.category.walk, bg: colors.category.walkBg },
  CULTURE: { emoji: '🎨', label: '문화', color: colors.category.culture, bg: colors.category.cultureBg },
  ANYTHING: { emoji: '🎲', label: '뭐든', color: colors.category.anything, bg: colors.category.anythingBg },
};

interface Props {
  category: string;
  size?: number;
  showLabel?: boolean;
  selected?: boolean;
  onPress?: () => void;
}

export function CategoryIcon({ category, size = 44, showLabel = false, selected = false, onPress }: Props) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META['ANYTHING'];

  const content = (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <View
        style={[
          styles.iconBg,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: selected ? meta.color : meta.bg,
            borderWidth: selected ? 2 : 0,
            borderColor: meta.color,
          },
        ]}
      >
        <Text style={{ fontSize: size * 0.45 }}>{meta.emoji}</Text>
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: selected ? meta.color : colors.neutral.mediumGray }]}>
          {meta.label}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

interface MapMarkerProps {
  category: string;
  onPress?: () => void;
}

export function MapMarker({ category, onPress }: MapMarkerProps) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META['ANYTHING'];
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.markerContainer, { backgroundColor: meta.color }]}>
        <Text style={styles.markerEmoji}>{meta.emoji}</Text>
      </View>
      <View style={[styles.markerTail, { borderTopColor: meta.color }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing['2xs'] },
  iconBg: { alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerEmoji: { fontSize: 20 },
  markerTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
    marginTop: -1,
  },
});
