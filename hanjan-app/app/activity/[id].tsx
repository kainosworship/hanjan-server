import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { colors, typography, spacing } from '@/theme';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>활동 상세</Text>
        <Text style={styles.id}>{id}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  content: { flex: 1, padding: spacing['2xl'] },
  title: { ...typography.h1, color: colors.neutral.charcoal },
  id: { ...typography.bodyM, color: colors.neutral.mediumGray, marginTop: spacing.sm },
});
