import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/theme';

export default function RewardUnlockedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>축하합니다!</Text>
        <Text style={styles.subtitle}>한잔 Plus 1개월이 지급되었습니다</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  content: { flex: 1, padding: spacing['2xl'], justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 80, marginBottom: spacing.xl },
  title: { ...typography.display, color: colors.neutral.charcoal, marginBottom: spacing.sm },
  subtitle: { ...typography.bodyL, color: colors.neutral.mediumGray, textAlign: 'center' },
});
