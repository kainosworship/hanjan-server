import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme';

interface Meeting {
  id: string;
  venueName: string;
  venueAddress?: string;
  scheduledAt: string | Date;
}

interface Props {
  meeting: Meeting;
  partnerNickname?: string;
  onSafetySettings?: () => void;
}

export function MeetingConfirmedCard({ meeting, partnerNickname, onSafetySettings }: Props) {
  const scheduledAt = new Date(meeting.scheduledAt);
  const dateStr = scheduledAt.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
  const timeStr = scheduledAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <View style={styles.celebrationBadge}>
        <Text style={styles.celebrationEmoji}>🎉</Text>
        <Text style={styles.celebrationText}>만남이 확정되었어요!</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>만남 확정 카드</Text>
        {partnerNickname && (
          <Text style={styles.partner}>
            <Text style={styles.partnerName}>{partnerNickname}</Text>님과의 만남
          </Text>
        )}

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📍</Text>
            <View>
              <Text style={styles.infoLabel}>장소</Text>
              <Text style={styles.infoValue}>{meeting.venueName}</Text>
              {meeting.venueAddress && <Text style={styles.infoSub}>{meeting.venueAddress}</Text>}
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🕐</Text>
            <View>
              <Text style={styles.infoLabel}>시간</Text>
              <Text style={styles.infoValue}>
                {dateStr} {timeStr}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.safetyBanner}>
          <Text style={styles.safetyIcon}>🛡️</Text>
          <Text style={styles.safetyText}>안심 만남 설정으로 더 안전하게 만나세요</Text>
        </View>

        {onSafetySettings && (
          <TouchableOpacity style={styles.safetyButton} onPress={onSafetySettings} activeOpacity={0.8}>
            <Text style={styles.safetyButtonText}>안심 설정하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  celebrationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  celebrationEmoji: { fontSize: 32 },
  celebrationText: { ...typography.h2, color: colors.neutral.charcoal },
  card: {
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: radius['2xl'],
    padding: spacing['2xl'],
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.primary.light,
  },
  title: { ...typography.h2, color: colors.neutral.charcoal, textAlign: 'center', marginBottom: spacing.xs },
  partner: { ...typography.bodyL, color: colors.neutral.mediumGray, textAlign: 'center', marginBottom: spacing.xl },
  partnerName: { color: colors.primary.coral, fontWeight: '700' },
  infoRow: { marginBottom: spacing.lg },
  infoItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  infoIcon: { fontSize: 24, marginTop: 2 },
  infoLabel: { ...typography.caption, color: colors.neutral.mediumGray, marginBottom: 2 },
  infoValue: { ...typography.bodyL, color: colors.neutral.charcoal, fontWeight: '600' },
  infoSub: { ...typography.bodyS, color: colors.neutral.mediumGray },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary.light,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  safetyIcon: { fontSize: 18 },
  safetyText: { ...typography.bodyS, color: colors.primary.dark, flex: 1 },
  safetyButton: {
    backgroundColor: colors.primary.coral,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  safetyButtonText: { ...typography.buttonM, color: colors.neutral.pureWhite },
});
