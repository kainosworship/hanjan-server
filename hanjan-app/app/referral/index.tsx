import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '@/theme';

export default function ReferralScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>친구 초대 🎁</Text>
        <Text style={styles.subtitle}>친구 3명 초대 = 한잔 Plus 1개월 무료</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>나의 초대 코드</Text>
          <Text style={styles.code}>ABC123</Text>
          <TouchableOpacity style={styles.copyBtn}>
            <Text style={styles.copyBtnText}>복사</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  content: { flex: 1, padding: spacing['2xl'] },
  title: { ...typography.h1, color: colors.neutral.charcoal, marginBottom: spacing.sm },
  subtitle: { ...typography.bodyL, color: colors.neutral.mediumGray, marginBottom: spacing['3xl'] },
  codeBox: {
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  codeLabel: { ...typography.caption, color: colors.neutral.mediumGray, marginBottom: spacing.xs },
  code: { ...typography.h1, color: colors.primary.coral, marginBottom: spacing.md, letterSpacing: 4 },
  copyBtn: {
    backgroundColor: colors.primary.light,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  copyBtnText: { ...typography.buttonM, color: colors.primary.coral },
});
