import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme';
import type { ChatMessage } from '@/shared';

interface Props {
  message: ChatMessage;
  currentUserId: string;
  senderNickname?: string;
}

export function ChatBubble({ message, currentUserId, senderNickname }: Props) {
  const isMe = message.senderId === currentUserId;
  const time = new Date(message.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  const msgType = message.messageType.toLowerCase();

  if (msgType === 'system') {
    return (
      <View style={styles.systemContainer}>
        <Text style={styles.systemText}>{message.content}</Text>
      </View>
    );
  }

  if (msgType === 'venue_share') {
    const meta = message.metadata ?? {};
    return (
      <View style={[styles.row, isMe && styles.rowReverse]}>
        <View style={[styles.venueBubble, isMe && styles.venueBubbleMe]}>
          <View style={styles.venueHeader}>
            <Text style={styles.venueIcon}>📍</Text>
            <Text style={styles.venueTitle}>장소 공유</Text>
          </View>
          <Text style={styles.venueName}>{String(meta['name'] ?? '')}</Text>
          {meta['address'] ? <Text style={styles.venueAddress}>{String(meta['address'])}</Text> : null}
          <Text style={styles.bubbleTime}>{time}</Text>
        </View>
      </View>
    );
  }

  if (msgType === 'meeting_proposal') {
    const meta = message.metadata ?? {};
    const scheduledAt = meta['scheduledAt'] ? new Date(String(meta['scheduledAt'])) : null;
    const dateStr = scheduledAt
      ? scheduledAt.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) +
        ' ' +
        scheduledAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      : '';

    return (
      <View style={[styles.row, isMe && styles.rowReverse]}>
        <View style={styles.proposalBubble}>
          <Text style={styles.proposalIcon}>🤝</Text>
          <Text style={styles.proposalTitle}>만남 제안</Text>
          {meta['venueName'] ? <Text style={styles.proposalVenue}>📍 {String(meta['venueName'])}</Text> : null}
          {dateStr ? <Text style={styles.proposalDate}>🕐 {dateStr}</Text> : null}
          <Text style={styles.bubbleTime}>{time}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.row, isMe && styles.rowReverse]}>
      {!isMe && senderNickname && (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{senderNickname.charAt(0)}</Text>
        </View>
      )}
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
          {message.content}
        </Text>
        <Text style={[styles.time, isMe ? styles.timeMe : styles.timeOther]}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, marginVertical: 2, paddingHorizontal: spacing.lg },
  rowReverse: { flexDirection: 'row-reverse' },
  systemContainer: { alignItems: 'center', marginVertical: spacing.sm },
  systemText: { ...typography.caption, color: colors.neutral.mediumGray, backgroundColor: colors.neutral.lightGray, paddingHorizontal: spacing.md, paddingVertical: spacing['2xs'], borderRadius: radius.full },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
  },
  bubbleMe: { backgroundColor: colors.primary.coral, borderBottomRightRadius: radius.xs },
  bubbleOther: { backgroundColor: colors.neutral.pureWhite, borderBottomLeftRadius: radius.xs, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  messageText: { ...typography.bodyM, lineHeight: 20 },
  messageTextMe: { color: colors.neutral.pureWhite },
  messageTextOther: { color: colors.neutral.charcoal },
  time: { fontSize: 10, marginTop: 2 },
  timeMe: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
  timeOther: { color: colors.neutral.mediumGray },
  avatarPlaceholder: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.secondary.amberLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 12, fontWeight: '700', color: colors.secondary.amber },
  venueBubble: {
    maxWidth: '80%',
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.semantic.info + '44',
    padding: spacing.md,
    gap: spacing['2xs'],
  },
  venueBubbleMe: { borderColor: colors.primary.light },
  venueHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  venueIcon: { fontSize: 16 },
  venueTitle: { ...typography.caption, color: colors.semantic.info, fontWeight: '700' },
  venueName: { ...typography.bodyM, color: colors.neutral.charcoal, fontWeight: '600' },
  venueAddress: { ...typography.bodyS, color: colors.neutral.mediumGray },
  proposalBubble: {
    backgroundColor: colors.primary.light,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing['2xs'],
    borderWidth: 1,
    borderColor: colors.primary.coral + '44',
  },
  proposalIcon: { fontSize: 20, textAlign: 'center' },
  proposalTitle: { ...typography.bodyM, color: colors.primary.dark, fontWeight: '700', textAlign: 'center' },
  proposalVenue: { ...typography.bodyS, color: colors.neutral.darkGray },
  proposalDate: { ...typography.bodyS, color: colors.neutral.darkGray },
  bubbleTime: { ...typography.caption, color: colors.neutral.mediumGray, textAlign: 'right', marginTop: spacing['2xs'] },
});
