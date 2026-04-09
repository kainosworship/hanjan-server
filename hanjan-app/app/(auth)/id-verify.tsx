import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/theme';

export default function IdVerifyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>신분증 인증</Text>
        <Text style={styles.subtitle}>신분증을 촬영해주세요</Text>
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
