import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '@/theme';

export default function SubscriptionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.badge}>PLUS</Text>
        <Text style={styles.title}>한잔 Plus</Text>
        <Text style={styles.subtitle}>더 많은 활동, 더 긴 채팅</Text>
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>월간 구독</Text>
          <Text style={styles.planPrice}>₩9,900/월</Text>
        </View>
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>연간 구독</Text>
          <Text style={styles.planPrice}>₩79,900/년 (33% 할인)</Text>
        </View>
        <TouchableOpacity style={styles.subscribeBtn}>
          <Text style={styles.subscribeBtnText}>구독 시작하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  content: { flex: 1, padding: spacing['2xl'] },
  badge: { ...typography.overline, color: colors.primary.coral, marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.neutral.charcoal, marginBottom: spacing.xs },
  subtitle: { ...typography.bodyL, color: colors.neutral.mediumGray, marginBottom: spacing['3xl'] },
  planCard: {
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  planTitle: { ...typography.h3, color: colors.neutral.charcoal },
  planPrice: { ...typography.bodyL, color: colors.primary.coral, marginTop: spacing.xs },
  subscribeBtn: {
    backgroundColor: colors.primary.coral,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  subscribeBtnText: { ...typography.buttonL, color: colors.neutral.pureWhite },
});
