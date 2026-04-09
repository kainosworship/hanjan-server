import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, typography, spacing, radius } from '@/theme';
import { ActivityCategoryPicker } from '@/components/activity/ActivityCategoryPicker';
import { ActivityTimePicker } from '@/components/activity/ActivityTimePicker';
import { ActivityRadiusSelector } from '@/components/activity/ActivityRadiusSelector';
import { ActivityGroupSizeSelector } from '@/components/activity/ActivityGroupSizeSelector';
import { Button } from '@/components/ui/Button';
import { useActivities } from '@/hooks/useActivities';

const TIMING_TO_SCHEDULED: Record<string, () => Date> = {
  now: () => new Date(),
  '30min': () => new Date(Date.now() + 30 * 60 * 1000),
  '1hour': () => new Date(Date.now() + 60 * 60 * 1000),
  tonight: () => {
    const d = new Date();
    d.setHours(19, 0, 0, 0);
    if (d < new Date()) d.setDate(d.getDate() + 1);
    return d;
  },
  custom: () => new Date(Date.now() + 2 * 60 * 60 * 1000),
};

export default function CreateScreen() {
  const [category, setCategory] = useState('coffee');
  const [timing, setTiming] = useState('now');
  const [radiusKm, setRadiusKm] = useState<1 | 2 | 5>(2);
  const [groupSize, setGroupSize] = useState('1:1');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { createActivity, getDailyCount } = useActivities();

  const MOCK_LAT = 37.5665;
  const MOCK_LNG = 126.978;

  const handleCreate = async () => {
    setLoading(true);
    try {
      const dailyResult = await getDailyCount().catch(() => ({ count: 0, limit: 2 }));
      if (dailyResult.count >= dailyResult.limit) {
        Alert.alert(
          '일일 한도 초과',
          '무료 회원은 하루 2회까지 활동을 올릴 수 있어요.\nPlus로 업그레이드하면 무제한으로 올릴 수 있어요!',
          [
            { text: '확인', style: 'cancel' },
            { text: 'Plus 알아보기', onPress: () => router.push('/subscription') },
          ],
        );
        return;
      }

      const scheduledAt = TIMING_TO_SCHEDULED[timing]?.() ?? new Date();
      await createActivity({
        category,
        timing,
        scheduledAt: scheduledAt.toISOString(),
        radiusKm,
        groupSize,
        message: message.trim() || undefined,
        locationLat: MOCK_LAT,
        locationLng: MOCK_LNG,
      });

      Alert.alert('활동 올리기 완료!', '주변 사람들이 내 활동을 볼 수 있어요 🎉', [
        { text: '확인', onPress: () => router.replace('/(tabs)/map') },
      ]);
    } catch (_) {
      Alert.alert('오류', '활동을 만드는 데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.title}>활동 만들기</Text>
          <Text style={styles.subtitle}>지금 뭘 하고 싶으신가요?</Text>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ActivityCategoryPicker selected={category} onSelect={setCategory} />
          <ActivityTimePicker selected={timing} onSelect={setTiming} />
          <ActivityRadiusSelector selected={radiusKm} onSelect={setRadiusKm} />
          <ActivityGroupSizeSelector selected={groupSize} onSelect={setGroupSize} />

          <View style={styles.messageSection}>
            <Text style={styles.sectionLabel}>한 마디 (선택)</Text>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="지금 내 상황이나 원하는 것을 간단히 써보세요"
              placeholderTextColor={colors.neutral.mediumGray}
              maxLength={50}
              multiline
            />
            <Text style={styles.charCount}>{message.length}/50</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button label="활동 올리기 🎯" onPress={handleCreate} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.neutral.pureWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGray,
  },
  title: { ...typography.h1, color: colors.neutral.charcoal },
  subtitle: { ...typography.bodyM, color: colors.neutral.mediumGray, marginTop: spacing.xs },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing['2xl'], paddingBottom: 100 },
  messageSection: { marginBottom: spacing['2xl'] },
  sectionLabel: { ...typography.h3, color: colors.neutral.charcoal, marginBottom: spacing.md },
  messageInput: {
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.neutral.lightGray,
    padding: spacing.lg,
    ...typography.bodyL,
    color: colors.neutral.charcoal,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: { ...typography.caption, color: colors.neutral.mediumGray, textAlign: 'right', marginTop: spacing.xs },
  footer: {
    padding: spacing['2xl'],
    backgroundColor: colors.neutral.pureWhite,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.lightGray,
  },
});
