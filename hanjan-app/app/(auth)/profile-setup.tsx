import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/theme';

export default function ProfileSetupScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>기본 정보 입력</Text>
        <Text style={styles.subtitle}>닉네임과 생년월일을 입력해주세요</Text>
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
