import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, typography, spacing, radius } from '@/theme';
import { useChat } from '@/hooks/useChat';
import { useMatching } from '@/hooks/useMatching';
import { useMatchStore } from '@/stores/matchStore';
import { useAuthStore } from '@/stores/authStore';
import { MatchNotificationCard } from '@/components/matching/MatchNotificationCard';
import type { ChatRoom, ChatMessage } from 'hanjan-shared';

interface MatchUser {
  id: string;
  nickname: string;
  profileImageUrl?: string | null;
}

interface MatchWithUsers {
  id: string;
  requesterId: string;
  accepterId: string;
  requester: MatchUser;
  accepter: MatchUser;
  activity?: { category: string } | null;
}

interface ChatRoomWithRelations extends ChatRoom {
  match: MatchWithUsers;
  messages: ChatMessage[];
  timerExpiresAt: Date | string;
}

interface PendingMatchWithRelations {
  id: string;
  activityId: string;
  requesterId: string;
  accepterId: string;
  status: string;
  chatRoomId?: string;
  createdAt: Date;
  respondedAt?: Date;
  requester?: MatchUser | null;
  accepter?: MatchUser | null;
  activity?: { category: string; message?: string; timing: string } | null;
  distanceMeters?: number;
}

const CATEGORY_META: Record<string, { emoji: string }> = {
  COFFEE: { emoji: '☕' },
  MEAL: { emoji: '🍽️' },
  DRINK: { emoji: '🍺' },
  WALK: { emoji: '🚶' },
  CULTURE: { emoji: '🎨' },
  ANYTHING: { emoji: '🎲' },
};

const STATUS_META: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: '진행 중', color: colors.primary.coral },
  MEETING_CONFIRMED: { label: '만남 확정', color: colors.semantic.success },
  TIMER_EXPIRED: { label: '시간 초과', color: colors.neutral.mediumGray },
  CLOSED: { label: '종료', color: colors.neutral.mediumGray },
};

export default function ChatsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const { rooms, fetchRooms } = useChat();
  const { fetchPending, acceptMatch, rejectMatch } = useMatching();
  const { pendingMatches: storePending } = useMatchStore();
  const { user } = useAuthStore();

  const currentUserId = user?.id ?? '';

  const load = useCallback(async () => {
    try {
      await Promise.all([fetchRooms(), fetchPending()]);
    } catch (_) {}
  }, []);

  useEffect(() => {
    load();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleAccept = async (matchId: string) => {
    setAcceptingId(matchId);
    try {
      const match = await acceptMatch(matchId);
      if (match.chatRoomId) {
        router.push(`/chat/${match.chatRoomId}`);
      }
    } catch (_) {
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (matchId: string) => {
    try {
      await rejectMatch(matchId);
    } catch (_) {}
  };

  const formatTime = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diff < 1) return '방금 전';
    if (diff < 60) return `${diff}분 전`;
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  const getTimerDisplay = (expiresAt: string | Date) => {
    const remaining = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
    if (remaining <= 0) return '만료';
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>채팅</Text>
      </View>

      <FlatList
        data={[...(storePending.length > 0 ? ['pending' as const] : []), ...rooms]}
        keyExtractor={(item, index) => (typeof item === 'string' ? 'pending-section' : (item as ChatRoomWithRelations).id ?? String(index))}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary.coral} />}
        ListHeaderComponent={
          storePending.length > 0 ? (
            <View style={styles.pendingSection}>
              <Text style={styles.sectionTitle}>📬 매칭 요청 {storePending.length}개</Text>
              {(storePending as PendingMatchWithRelations[]).map((match) => (
                <MatchNotificationCard
                  key={match.id}
                  match={match}
                  currentUserId={currentUserId}
                  onAccept={() => handleAccept(match.id)}
                  onReject={() => handleReject(match.id)}
                  loading={acceptingId === match.id}
                />
              ))}
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          if (typeof item === 'string') return null;
          const room = item as ChatRoomWithRelations;
          const match = room.match;
          const partner = match.requesterId === currentUserId ? match.accepter : match.requester;
          const lastMsg: ChatMessage | undefined = room.messages?.[0];
          const catMeta = CATEGORY_META[match.activity?.category ?? 'ANYTHING'] ?? { emoji: '💬' };
          const statusMeta = STATUS_META[room.status?.toUpperCase()] ?? STATUS_META['ACTIVE'];
          const isActive = room.status?.toUpperCase() === 'ACTIVE';

          return (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => router.push(`/chat/${room.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.chatAvatar}>
                <Text style={styles.chatAvatarEmoji}>{catMeta.emoji}</Text>
              </View>
              <View style={styles.chatInfo}>
                <View style={styles.chatTopRow}>
                  <Text style={styles.chatPartnerName}>{partner?.nickname ?? '매칭 상대'}</Text>
                  <View style={styles.chatMeta}>
                    {isActive && (
                      <View style={styles.timerBadge}>
                        <Text style={styles.timerText}>⏱️ {getTimerDisplay(room.timerExpiresAt)}</Text>
                      </View>
                    )}
                    <Text style={styles.chatTime}>{lastMsg ? formatTime(lastMsg.createdAt) : ''}</Text>
                  </View>
                </View>
                <View style={styles.chatBottomRow}>
                  <Text style={styles.chatLastMsg} numberOfLines={1}>
                    {lastMsg?.content ?? '채팅을 시작해보세요!'}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusMeta.color + '22' }]}>
                    <Text style={[styles.statusText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyText}>아직 채팅이 없어요</Text>
            <Text style={styles.emptySubtext}>주변 활동에 참여해보세요!</Text>
          </View>
        }
        contentContainerStyle={rooms.length === 0 && storePending.length === 0 ? styles.emptyContainer : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  header: {
    padding: spacing['2xl'],
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGray,
    backgroundColor: colors.neutral.pureWhite,
  },
  title: { ...typography.h2, color: colors.neutral.charcoal },
  pendingSection: { paddingVertical: spacing.md },
  sectionTitle: { ...typography.bodyM, color: colors.neutral.charcoal, fontWeight: '700', paddingHorizontal: spacing['2xl'], marginBottom: spacing.sm },
  chatItem: {
    flexDirection: 'row',
    padding: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    backgroundColor: colors.neutral.pureWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGray,
    gap: spacing.md,
  },
  chatAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.secondary.amberLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatAvatarEmoji: { fontSize: 26 },
  chatInfo: { flex: 1 },
  chatTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing['2xs'] },
  chatPartnerName: { ...typography.bodyM, color: colors.neutral.charcoal, fontWeight: '600' },
  chatMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  timerBadge: { backgroundColor: colors.primary.light, paddingHorizontal: spacing.xs, paddingVertical: 2, borderRadius: radius.full },
  timerText: { fontSize: 11, color: colors.primary.coral, fontWeight: '600' },
  chatTime: { ...typography.caption, color: colors.neutral.mediumGray },
  chatBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatLastMsg: { ...typography.bodyS, color: colors.neutral.mediumGray, flex: 1 },
  statusBadge: { paddingHorizontal: spacing.xs, paddingVertical: 2, borderRadius: radius.full, marginLeft: spacing.xs },
  statusText: { fontSize: 11, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: spacing['5xl'] },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.md },
  emptyText: { ...typography.h3, color: colors.neutral.charcoal, marginBottom: spacing.xs },
  emptySubtext: { ...typography.bodyM, color: colors.neutral.mediumGray },
  emptyContainer: { flex: 1 },
});
