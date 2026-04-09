import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '@/theme';
import { ChatTimer } from './ChatTimer';

interface Props {
  partnerNickname?: string;
  partnerMannerScore?: number;
  category?: string;
  seconds: number;
  isWarning: boolean;
  isUrgent: boolean;
  isExpired: boolean;
  onBack?: () => void;
}

const CATEGORY_META: Record<string, { emoji: string }> = {
  COFFEE: { emoji: '☕' },
  MEAL: { emoji: '🍽️' },
  DRINK: { emoji: '🍺' },
  WALK: { emoji: '🚶' },
  CULTURE: { emoji: '🎨' },
  ANYTHING: { emoji: '🎲' },
};

export function ChatRoomHeader({
  partnerNickname,
  partnerMannerScore,
  category,
  seconds,
  isWarning,
  isUrgent,
  isExpired,
  onBack,
}: Props) {
  const catMeta = category ? (CATEGORY_META[category] ?? CATEGORY_META['ANYTHING']) : { emoji: '💬' };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Text style={styles.backIcon}>‹</Text>
      </TouchableOpacity>

      <View style={styles.centerInfo}>
        <View style={styles.partnerRow}>
          <Text style={styles.categoryEmoji}>{catMeta.emoji}</Text>
          <Text style={styles.partnerName}>{partnerNickname ?? '매칭 상대'}</Text>
          {typeof partnerMannerScore === 'number' && (
            <View style={styles.mannerBadge}>
              <Text style={styles.mannerText}>⭐ {partnerMannerScore.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>

      <ChatTimer seconds={seconds} isWarning={isWarning} isUrgent={isUrgent} isExpired={isExpired} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral.pureWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGray,
    gap: spacing.md,
  },
  backBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: 28, color: colors.neutral.charcoal, lineHeight: 32 },
  centerInfo: { flex: 1 },
  partnerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  categoryEmoji: { fontSize: 18 },
  partnerName: { ...typography.bodyM, color: colors.neutral.charcoal, fontWeight: '600' },
  mannerBadge: { backgroundColor: colors.secondary.amberLight, paddingHorizontal: spacing.xs, paddingVertical: 2, borderRadius: 8 },
  mannerText: { ...typography.caption, color: colors.secondary.amber, fontWeight: '600' },
});
