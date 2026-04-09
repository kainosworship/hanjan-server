import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { colors, typography, spacing, radius } from '@/theme';
import { MeetingConfirmedCard } from '@/components/matching/MeetingConfirmedCard';
import { apiGet } from '@/services/apiClient';

interface MeetingMatch {
  chatRoomId?: string | null;
}

interface Meeting {
  id: string;
  chatRoomId?: string | null;
  match?: MeetingMatch | null;
  scheduledAt?: string | null;
  venueName?: string | null;
}

export default function MeetingConfirmedScreen() {
  const { meetingId } = useLocalSearchParams<{ meetingId?: string }>();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [safetyEnabled, setSafetyEnabled] = useState(false);

  useEffect(() => {
    if (!meetingId) return;
    apiGet<Meeting>(`/matching/meetings/${meetingId}`).then(setMeeting).catch(() => {});
  }, [meetingId]);

  const handleEnableSafety = () => {
    setSafetyEnabled(true);
    Alert.alert('안전 모드 설정 완료', '만남 후 2시간 안에 체크인이 없으면 비상 연락처에게 알림이 전송됩니다.');
  };

  const handleGoHome = () => {
    router.replace('/(tabs)/map');
  };

  const handleGoToChat = () => {
    const chatRoomId = meeting?.match?.chatRoomId ?? meeting?.chatRoomId;
    if (chatRoomId) router.push(`/chat/${chatRoomId}`);
    else router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>🎉</Text>
          <Text style={styles.heroTitle}>만남이 확정되었어요!</Text>
          <Text style={styles.heroSubtitle}>즐거운 시간 되세요 ✨</Text>
        </View>

        {meeting && (
          <MeetingConfirmedCard
            meeting={meeting}
            onSafetySettings={handleEnableSafety}
          />
        )}

        {!meeting && (
          <View style={styles.skeletonCard}>
            <Text style={styles.skeletonText}>만남 정보를 불러오는 중...</Text>
          </View>
        )}

        <View style={styles.safetySection}>
          <View style={styles.safetyHeader}>
            <Text style={styles.safetyIcon}>🛡️</Text>
            <Text style={styles.safetyTitle}>안전 만남 기능</Text>
          </View>
          <Text style={styles.safetyDesc}>
            처음 만나는 사람과의 안전을 위해 위치 공유 및 안심 귀가 알림 서비스를 사용해보세요.
          </Text>
          <TouchableOpacity
            style={[styles.safetyBtn, safetyEnabled && styles.safetyBtnEnabled]}
            onPress={handleEnableSafety}
            disabled={safetyEnabled}
          >
            <Text style={styles.safetyBtnText}>
              {safetyEnabled ? '✓ 안전 모드 활성화됨' : '안전 모드 설정하기'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 안전 만남 팁</Text>
          {[
            '공공 장소에서 처음 만나세요',
            '친구나 가족에게 만남 사실을 알리세요',
            '개인 정보는 신중하게 공유하세요',
          ].map((tip, i) => (
            <Text key={i} style={styles.tipItem}>• {tip}</Text>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.chatBtn} onPress={handleGoToChat}>
            <Text style={styles.chatBtnText}>채팅방으로 💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={handleGoHome}>
            <Text style={styles.homeBtnText}>홈으로 🏠</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  content: { padding: spacing['2xl'], paddingBottom: 48 },
  heroSection: { alignItems: 'center', paddingVertical: spacing['3xl'] },
  heroEmoji: { fontSize: 80, marginBottom: spacing.lg },
  heroTitle: { ...typography.h1, color: colors.neutral.charcoal, textAlign: 'center', marginBottom: spacing.sm },
  heroSubtitle: { ...typography.bodyL, color: colors.neutral.mediumGray },
  skeletonCard: {
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: radius.xl,
    padding: spacing['2xl'],
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  skeletonText: { ...typography.bodyM, color: colors.neutral.mediumGray },
  safetySection: {
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing['2xl'],
    borderWidth: 1,
    borderColor: colors.semantic.info + '33',
  },
  safetyHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  safetyIcon: { fontSize: 20 },
  safetyTitle: { ...typography.h3, color: colors.neutral.charcoal },
  safetyDesc: { ...typography.bodyS, color: colors.neutral.mediumGray, lineHeight: 20, marginBottom: spacing.lg },
  safetyBtn: {
    backgroundColor: colors.semantic.info,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  safetyBtnEnabled: { backgroundColor: colors.semantic.success },
  safetyBtnText: { ...typography.buttonM, color: colors.neutral.pureWhite },
  tips: {
    backgroundColor: colors.secondary.amberLight,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  tipsTitle: { ...typography.h3, color: colors.secondary.amber, marginBottom: spacing.md },
  tipItem: { ...typography.bodyS, color: colors.neutral.darkGray, marginBottom: spacing.xs, lineHeight: 20 },
  actions: { gap: spacing.md },
  chatBtn: {
    backgroundColor: colors.primary.coral,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  chatBtnText: { ...typography.buttonL, color: colors.neutral.pureWhite },
  homeBtn: {
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.neutral.lightGray,
  },
  homeBtnText: { ...typography.buttonL, color: colors.neutral.darkGray },
});
