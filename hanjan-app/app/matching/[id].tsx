import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { colors, typography, spacing } from '@/theme';
import { MatchNotificationCard } from '@/components/matching/MatchNotificationCard';
import { useMatching } from '@/hooks/useMatching';
import { useAuthStore } from '@/stores/authStore';
import { apiGet } from '@/services/apiClient';

interface MatchUser {
  id: string;
  nickname: string;
  isIdVerified?: boolean;
  isSelfieVerified?: boolean;
  mannerScore?: { overallScore?: number } | null;
}

interface PendingMatch {
  id: string;
  requesterId: string;
  accepterId: string;
  status: string;
  requester: MatchUser;
  accepter: MatchUser;
  activity?: { category?: string; message?: string } | null;
  chatRoomId?: string | null;
}

export default function MatchingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [match, setMatch] = useState<PendingMatch | null>(null);
  const [loading, setLoading] = useState(false);
  const { acceptMatch, rejectMatch } = useMatching();
  const { user } = useAuthStore();

  const currentUserId = user?.id ?? '';

  useEffect(() => {
    if (!id) return;
    apiGet<PendingMatch[]>('/matching/pending').then((matches) => {
      const found = matches.find((m) => m.id === id);
      if (found) setMatch(found);
    }).catch(() => {});
  }, [id]);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const accepted = await acceptMatch(id);
      if (accepted.chatRoomId) {
        router.replace(`/chat/${accepted.chatRoomId}`);
      }
    } catch (_) {
      Alert.alert('오류', '수락에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      await rejectMatch(id);
      router.back();
    } catch (_) {}
  };

  if (!match) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>매칭 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>매칭 알림 🔔</Text>
        <MatchNotificationCard
          match={match}
          currentUserId={currentUserId}
          onAccept={handleAccept}
          onReject={handleReject}
          loading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  content: { padding: spacing['2xl'] },
  title: { ...typography.h1, color: colors.neutral.charcoal, marginBottom: spacing.xl },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { ...typography.bodyM, color: colors.neutral.mediumGray },
});
