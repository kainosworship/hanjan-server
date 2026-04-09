import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '@/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🍷 한잔</Text>
        <Text style={styles.subtitle}>지금 주변에서 한잔 할 사람</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(auth)/phone-verify')}>
          <Text style={styles.primaryBtnText}>시작하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.secondaryBtnText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 48, marginBottom: spacing.md },
  subtitle: { ...typography.h2, color: colors.neutral.darkGray, textAlign: 'center' },
  actions: { padding: spacing['2xl'], gap: spacing.md },
  primaryBtn: {
    backgroundColor: colors.primary.coral,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  primaryBtnText: { ...typography.buttonL, color: colors.neutral.pureWhite },
  secondaryBtn: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  secondaryBtnText: { ...typography.buttonL, color: colors.neutral.darkGray },
});
