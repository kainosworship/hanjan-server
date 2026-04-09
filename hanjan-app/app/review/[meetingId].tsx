import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { colors, typography, spacing } from '@/theme';

export default function ReviewScreen() {
  const { meetingId } = useLocalSearchParams<{ meetingId: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>만남 평가</Text>
        <Text style={styles.subtitle}>어떠셨나요?</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  content: { flex: 1, padding: spacing['2xl'] },
  title: { ...typography.h1, color: colors.neutral.charcoal, marginBottom: spacing.sm },
  subtitle: { ...typography.bodyL, color: colors.neutral.mediumGray },
});
