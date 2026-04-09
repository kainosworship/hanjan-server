import React from 'react';
import { FlatList, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { colors, typography, spacing } from '@/theme';
import { ActivityCard } from './ActivityCard';
import type { ActivityCard as ActivityCardType } from 'hanjan-shared';

interface Props {
  activities: ActivityCardType[];
  onPressActivity?: (activity: ActivityCardType) => void;
  onJoinActivity?: (activity: ActivityCardType) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function ActivityListView({
  activities,
  onPressActivity,
  onJoinActivity,
  onRefresh,
  refreshing = false,
}: Props) {
  if (activities.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🗺️</Text>
        <Text style={styles.emptyTitle}>주변에 활동이 없어요</Text>
        <Text style={styles.emptySubtitle}>첫 번째로 활동을 올려보세요!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ActivityCard
          activity={item}
          onPress={() => onPressActivity?.(item)}
          onJoin={() => onJoinActivity?.(item)}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.coral} />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: spacing.md, paddingBottom: spacing['5xl'] },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.sm },
  emptyTitle: { ...typography.h2, color: colors.neutral.charcoal },
  emptySubtitle: { ...typography.bodyM, color: colors.neutral.mediumGray },
});
