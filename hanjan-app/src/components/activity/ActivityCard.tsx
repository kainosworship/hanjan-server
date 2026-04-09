import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme';
import type { ActivityCard as ActivityCardType } from '@/shared';

const CATEGORY_META: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
  COFFEE: { emoji: '☕', label: '커피 한잔', color: colors.category.coffee, bg: colors.category.coffeeBg },
  MEAL: { emoji: '🍽️', label: '같이 밥', color: colors.category.meal, bg: colors.category.mealBg },
  DRINK: { emoji: '🍺', label: '한잔 하자', color: colors.category.drink, bg: colors.category.drinkBg },
  WALK: { emoji: '🚶', label: '산책/운동', color: colors.category.walk, bg: colors.category.walkBg },
  CULTURE: { emoji: '🎨', label: '문화생활', color: colors.category.culture, bg: colors.category.cultureBg },
  ANYTHING: { emoji: '🎲', label: '뭐든 좋아', color: colors.category.anything, bg: colors.category.anythingBg },
};

const TIMING_LABEL: Record<string, string> = {
  now: '지금 즉시',
  '30min': '30분 후',
  '1hour': '1시간 후',
  tonight: '오늘 저녁',
  custom: '시간 조율',
  NOW: '지금 즉시',
  THIRTY_MIN: '30분 후',
  ONE_HOUR: '1시간 후',
  TONIGHT: '오늘 저녁',
  CUSTOM: '시간 조율',
};

const GROUP_LABEL: Record<string, string> = {
  '1:1': '1:1',
  '2:2': '2:2',
  group: '소그룹',
  ONE_ON_ONE: '1:1',
  TWO_ON_TWO: '2:2',
  GROUP: '소그룹',
};

interface Props {
  activity: ActivityCardType;
  onPress?: () => void;
  onJoin?: () => void;
  compact?: boolean;
}

export function ActivityCard({ activity, onPress, onJoin, compact = false }: Props) {
  const meta = CATEGORY_META[activity.category?.toUpperCase()] ?? CATEGORY_META['ANYTHING'];
  const distance =
    activity.distanceMeters >= 1000
      ? `${(activity.distanceMeters / 1000).toFixed(1)}km`
      : `${Math.round(activity.distanceMeters)}m`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.categoryBar, { backgroundColor: meta.color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.categoryChip, { backgroundColor: meta.bg }]}>
            <Text style={styles.categoryEmoji}>{meta.emoji}</Text>
            <Text style={[styles.categoryLabel, { color: meta.color }]}>{meta.label}</Text>
          </View>
          <View style={styles.mannerBadge}>
            <Text style={styles.mannerStar}>⭐</Text>
            <Text style={styles.mannerScore}>
              {typeof activity.user?.mannerScore === 'number'
                ? activity.user.mannerScore.toFixed(1)
                : '4.0'}
            </Text>
          </View>
        </View>

        {activity.message ? (
          <Text style={styles.message} numberOfLines={2}>
            {activity.message}
          </Text>
        ) : null}

        <View style={styles.meta}>
          <Text style={styles.metaItem}>📍 {distance}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaItem}>⏰ {TIMING_LABEL[activity.timing] ?? activity.timing}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaItem}>👥 {GROUP_LABEL[activity.groupSize] ?? activity.groupSize}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: meta.bg }]}>
              <Text style={styles.avatarEmoji}>{meta.emoji}</Text>
            </View>
            <Text style={styles.nickname}>{activity.user?.nickname ?? '익명'}</Text>
            {activity.user?.verifiedBadge && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          {!compact && onJoin && (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={(e) => {
                e.stopPropagation();
                onJoin();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.joinButtonText}>참여하기</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: radius.xl,
    marginHorizontal: spacing['2xl'],
    marginVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  categoryBar: { width: 4 },
  content: { flex: 1, padding: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing['2xs'],
    borderRadius: radius.full,
    gap: spacing['2xs'],
  },
  categoryEmoji: { fontSize: 14 },
  categoryLabel: { fontSize: 12, fontWeight: '600' },
  mannerBadge: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  mannerStar: { fontSize: 12 },
  mannerScore: { ...typography.caption, color: colors.neutral.darkGray, fontWeight: '600' },
  message: { ...typography.bodyM, color: colors.neutral.darkGray, marginBottom: spacing.sm },
  meta: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, flexWrap: 'wrap', gap: 2 },
  metaItem: { ...typography.bodyS, color: colors.neutral.mediumGray },
  metaDot: { ...typography.bodyS, color: colors.neutral.lightGray, marginHorizontal: spacing['2xs'] },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 14 },
  nickname: { ...typography.bodyS, color: colors.neutral.charcoal, fontWeight: '500' },
  verifiedBadge: {
    backgroundColor: colors.semantic.success,
    borderRadius: radius.full,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: { color: colors.neutral.pureWhite, fontSize: 10, fontWeight: '700' },
  joinButton: {
    backgroundColor: colors.primary.coral,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  joinButtonText: { ...typography.buttonM, color: colors.neutral.pureWhite },
});
