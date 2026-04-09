import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, typography, spacing } from '@/theme';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>프로필</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.avatar}>👤</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings')}>
          <Text style={styles.menuText}>설정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/referral')}>
          <Text style={styles.menuText}>친구 초대 🎁</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/subscription')}>
          <Text style={styles.menuText}>Plus 구독</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  header: { padding: spacing['2xl'], borderBottomWidth: 1, borderBottomColor: colors.neutral.lightGray },
  title: { ...typography.h2, color: colors.neutral.charcoal },
  content: { flex: 1, padding: spacing['2xl'] },
  avatar: { fontSize: 64, textAlign: 'center', marginBottom: spacing['3xl'] },
  menuItem: { paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.neutral.lightGray },
  menuText: { ...typography.bodyL, color: colors.neutral.charcoal },
});
