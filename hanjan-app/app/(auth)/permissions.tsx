import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/theme';

export default function PermissionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>권한 설정</Text>
        <Text style={styles.subtitle}>위치와 알림 권한이 필요합니다</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  content: { flex: 1, padding: spacing['2xl'], justifyContent: 'center' },
  title: { ...typography.h1, color: colors.neutral.charcoal, marginBottom: spacing.sm },
  subtitle: { ...typography.bodyL, color: colors.neutral.mediumGray },
});
