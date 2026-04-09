import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme';
import type { Match } from 'hanjan-shared';

interface MatchUser {
  nickname: string;
  mannerScore?: { overallScore?: number; totalReviews?: number } | null;
  profileImageUrl?: string;
}

interface ExtendedMatch extends Match {
  requester?: MatchUser;
  accepter?: MatchUser;
  activity?: { category: string; message?: string; timing: string };
  distanceMeters?: number;
}

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  COFFEE: { emoji: '☕', color: colors.category.coffee },
  MEAL: { emoji: '🍽️', color: colors.category.meal },
  DRINK: { emoji: '🍺', color: colors.category.drink },
  WALK: { emoji: '🚶', color: colors.category.walk },
  CULTURE: { emoji: '🎨', color: colors.category.culture },
  ANYTHING: { emoji: '🎲', color: colors.category.anything },
};

interface Props {
  match: ExtendedMatch;
  currentUserId: string;
  onAccept: () => void;
  onReject: () => void;
  loading?: boolean;
}

export function MatchNotificationCard({ match, currentUserId, onAccept, onReject, loading = false }: Props) {
  const otherUser = match.requesterId === currentUserId ? match.accepter : match.requester;
  const catMeta = match.activity ? (CATEGORY_META[match.activity.category] ?? CATEGORY_META['ANYTHING']) : CATEGORY_META['ANYTHING'];
  const mannerScore = typeof otherUser?.mannerScore?.overallScore === 'number' ? otherUser.mannerScore.overallScore : 4.0;
  const totalReviews = otherUser?.mannerScore?.totalReviews ?? 0;
  const distance =
    match.distanceMeters !== undefined
      ? match.distanceMeters >= 1000
        ? `${(match.distanceMeters / 1000).toFixed(1)}km`
        : `${Math.round(match.distanceMeters)}m`
      : '알 수 없음';

  return (
    <View style={styles.card}>
      <View style={[styles.header, { backgroundColor: catMeta.color }]}>
        <Text style={styles.headerEmoji}>{catMeta.emoji}</Text>
        <Text style={styles.headerText}>매칭 요청이 왔어요!</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.userRow}>
          <View style={[styles.avatar, { backgroundColor: catMeta.color + '22' }]}>
            <Text style={styles.avatarEmoji}>{catMeta.emoji}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.nickname}>{otherUser?.nickname ?? '익명'}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.mannerBadge}>
                <Text style={styles.mannerStar}>⭐</Text>
                <Text style={styles.mannerScore}>{mannerScore.toFixed(1)}</Text>
              </View>
              <Text style={styles.reviewCount}>({totalReviews}회 만남)</Text>
            </View>
          </View>
        </View>

        {match.activity?.message && (
          <View style={styles.messageBox}>
            <Text style={styles.messagText}>💬 "{match.activity.message}"</Text>
          </View>
        )}

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>거리</Text>
            <Text style={styles.metaValue}>📍 {distance}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>매너 점수</Text>
            <Text style={styles.metaValue}>⭐ {mannerScore.toFixed(1)}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>만남 경험</Text>
            <Text style={styles.metaValue}>🤝 {totalReviews}회</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={onReject}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.rejectText}>다음에요 👋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acceptButton, loading && styles.disabledButton]}
            onPress={onAccept}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.acceptText}>수락하기 🤝</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: radius['2xl'],
    marginHorizontal: spacing['2xl'],
    marginVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerEmoji: { fontSize: 20 },
  headerText: { ...typography.bodyM, color: colors.neutral.pureWhite, fontWeight: '700' },
  body: { padding: spacing.lg },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 28 },
  userInfo: { flex: 1 },
  nickname: { ...typography.h3, color: colors.neutral.charcoal, marginBottom: spacing['2xs'] },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  mannerBadge: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  mannerStar: { fontSize: 14 },
  mannerScore: { ...typography.bodyS, color: colors.neutral.darkGray, fontWeight: '600' },
  reviewCount: { ...typography.caption, color: colors.neutral.mediumGray },
  messageBox: {
    backgroundColor: colors.neutral.warmWhite,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  messagText: { ...typography.bodyM, color: colors.neutral.darkGray, fontStyle: 'italic' },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.neutral.warmWhite,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  metaItem: { alignItems: 'center', flex: 1 },
  metaLabel: { ...typography.caption, color: colors.neutral.mediumGray, marginBottom: spacing['2xs'] },
  metaValue: { ...typography.bodyS, color: colors.neutral.charcoal, fontWeight: '600' },
  metaDivider: { width: 1, backgroundColor: colors.neutral.lightGray, marginVertical: spacing.xs },
  actions: { flexDirection: 'row', gap: spacing.sm },
  rejectButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.neutral.lightGray,
    alignItems: 'center',
  },
  rejectText: { ...typography.buttonM, color: colors.neutral.darkGray },
  acceptButton: {
    flex: 2,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.primary.coral,
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: colors.neutral.lightGray },
  acceptText: { ...typography.buttonM, color: colors.neutral.pureWhite },
});
