import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '@/theme';
import { ActivityListView } from '@/components/activity/ActivityListView';
import { ActivityCard } from '@/components/activity/ActivityCard';
import { useActivities } from '@/hooks/useActivities';
import { useMatching } from '@/hooks/useMatching';
import { useActivityStore } from '@/stores/activityStore';
import type { ActivityCard as ActivityCardType } from 'hanjan-shared';

const CATEGORIES = ['ALL', 'COFFEE', 'MEAL', 'DRINK', 'WALK', 'CULTURE', 'ANYTHING'];
const CATEGORY_META: Record<string, { emoji: string; label: string; color: string }> = {
  ALL: { emoji: '🗺️', label: '전체', color: colors.primary.coral },
  COFFEE: { emoji: '☕', label: '커피', color: '#8B4513' },
  MEAL: { emoji: '🍽️', label: '밥', color: '#E67E22' },
  DRINK: { emoji: '🍺', label: '한잔', color: '#2C3E50' },
  WALK: { emoji: '🚶', label: '산책', color: '#27AE60' },
  CULTURE: { emoji: '🎨', label: '문화', color: '#8E44AD' },
  ANYTHING: { emoji: '🎲', label: '뭐든', color: '#16A085' },
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_HEIGHT = 400;
const MAP_VIEW_DELTA = 0.05;

interface MarkerPosition {
  x: number;
  y: number;
  activity: ActivityCardType;
}

function computeMarkerPosition(
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number,
  mapWidth: number,
  mapHeight: number,
): { x: number; y: number } {
  const latRange = MAP_VIEW_DELTA;
  const lngRange = MAP_VIEW_DELTA;
  const x = ((lng - centerLng) / lngRange + 0.5) * mapWidth;
  const y = ((centerLat - lat) / latRange + 0.5) * mapHeight;
  return { x, y };
}

export default function MapScreen() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedActivity, setSelectedActivity] = useState<ActivityCardType | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [mapWidth, setMapWidth] = useState(SCREEN_WIDTH);

  const { fetchNearby } = useActivities();
  const { requestMatch } = useMatching();
  const { nearbyActivities } = useActivityStore();

  const MOCK_LAT = 37.5665;
  const MOCK_LNG = 126.978;

  const loadActivities = useCallback(async () => {
    try {
      await fetchNearby({ lat: MOCK_LAT, lng: MOCK_LNG, radiusKm: 5 });
    } catch (_) {}
  }, []);

  useEffect(() => {
    loadActivities();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadActivities();
    setRefreshing(false);
  };

  const handleJoinActivity = async (activity: ActivityCardType) => {
    try {
      await requestMatch(activity.id);
      Alert.alert('참여 요청 완료!', '상대방이 수락하면 채팅이 시작돼요 🎉');
    } catch (_) {
      Alert.alert('오류', '참여 요청에 실패했습니다.');
    }
  };

  const filtered =
    selectedCategory === 'ALL'
      ? nearbyActivities
      : nearbyActivities.filter((a) => a.category?.toUpperCase() === selectedCategory);

  const markers: MarkerPosition[] = filtered.map((activity) => {
    const pos = computeMarkerPosition(
      activity.locationLat,
      activity.locationLng,
      MOCK_LAT,
      MOCK_LNG,
      mapWidth,
      MAP_HEIGHT,
    );
    return { ...pos, activity };
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>지금 주변 활동</Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
              onPress={() => setViewMode('list')}
            >
              <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>목록</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
              onPress={() => setViewMode('map')}
            >
              <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>지도</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContent}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const meta = CATEGORY_META[cat];
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={styles.categoryEmoji}>{meta.emoji}</Text>
                <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelActive]}>
                  {meta.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          <View
            style={styles.mapSurface}
            onLayout={(e) => setMapWidth(e.nativeEvent.layout.width)}
          >
            <View style={styles.mapGrid}>
              {Array.from({ length: 5 }).map((_, i) => (
                <View key={`h${i}`} style={[styles.gridLineH, { top: (MAP_HEIGHT / 4) * i }]} />
              ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <View key={`v${i}`} style={[styles.gridLineV, { left: (mapWidth / 4) * i }]} />
              ))}
            </View>

            <View style={styles.myMarker}>
              <View style={styles.myMarkerDot} />
              <View style={styles.myMarkerRing} />
            </View>

            {markers.map(({ x, y, activity }, idx) => {
              const catKey = activity.category?.toUpperCase() ?? 'ANYTHING';
              const catMeta = CATEGORY_META[catKey] ?? CATEGORY_META['ANYTHING'];
              const isSelected = selectedActivity?.id === activity.id;
              const clampedX = Math.max(16, Math.min(mapWidth - 16, x));
              const clampedY = Math.max(16, Math.min(MAP_HEIGHT - 16, y));
              return (
                <TouchableOpacity
                  key={activity.id}
                  style={[
                    styles.marker,
                    { left: clampedX - 18, top: clampedY - 18 },
                    isSelected && styles.markerSelected,
                  ]}
                  onPress={() => setSelectedActivity(isSelected ? null : activity)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.markerEmoji}>{catMeta.emoji}</Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.mapLegend}>
              <Text style={styles.mapLegendText}>서울 시청 주변 {filtered.length}개 활동</Text>
            </View>
          </View>

          {filtered.length > 0 && (
            <View style={styles.mapListOverlay}>
              <Text style={styles.mapListTitle}>주변 {filtered.length}개 활동</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCards}>
                {filtered.map((activity) => (
                  <View key={activity.id} style={styles.compactCard}>
                    <ActivityCard
                      activity={activity}
                      onPress={() => setSelectedActivity(activity)}
                      compact
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      ) : (
        <ActivityListView
          activities={filtered}
          onPressActivity={setSelectedActivity}
          onJoinActivity={handleJoinActivity}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}

      <Modal
        visible={!!selectedActivity}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedActivity(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setSelectedActivity(null)}
        />
        {selectedActivity && (
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <ActivityCard
              activity={selectedActivity}
              onJoin={() => {
                handleJoinActivity(selectedActivity);
                setSelectedActivity(null);
              }}
            />
            <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedActivity(null)}>
              <Text style={styles.modalCloseText}>닫기</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  header: {
    backgroundColor: colors.neutral.pureWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGray,
    paddingBottom: spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: { ...typography.h2, color: colors.neutral.charcoal },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.warmWhite,
    borderRadius: radius.md,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  toggleBtnActive: { backgroundColor: colors.neutral.pureWhite },
  toggleText: { ...typography.bodyS, color: colors.neutral.mediumGray, fontWeight: '500' },
  toggleTextActive: { color: colors.neutral.charcoal, fontWeight: '600' },
  categoryScroll: {},
  categoryContent: { paddingHorizontal: spacing['2xl'], gap: spacing.sm, paddingVertical: spacing.xs },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.neutral.warmWhite,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
  },
  categoryChipActive: { backgroundColor: colors.primary.coral, borderColor: colors.primary.coral },
  categoryEmoji: { fontSize: 16 },
  categoryLabel: { ...typography.bodyS, color: colors.neutral.darkGray, fontWeight: '500' },
  categoryLabelActive: { color: colors.neutral.pureWhite, fontWeight: '600' },
  mapContainer: { flex: 1 },
  mapSurface: {
    height: MAP_HEIGHT,
    backgroundColor: '#C8DFC8',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGrid: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  myMarker: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -16,
    marginTop: -16,
  },
  myMarkerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4A90E2',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  myMarkerRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(74,144,226,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(74,144,226,0.4)',
  },
  marker: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral.pureWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.neutral.lightGray,
  },
  markerSelected: {
    borderColor: colors.primary.coral,
    borderWidth: 2.5,
    shadowOpacity: 0.3,
  },
  markerEmoji: { fontSize: 18 },
  mapLegend: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing['2xs'],
  },
  mapLegendText: { ...typography.caption, color: colors.neutral.charcoal },
  mapListOverlay: {
    backgroundColor: colors.neutral.pureWhite,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.lightGray,
    paddingTop: spacing.md,
    maxHeight: 220,
  },
  mapListTitle: { ...typography.bodyS, color: colors.neutral.mediumGray, paddingHorizontal: spacing['2xl'], marginBottom: spacing.xs },
  horizontalCards: { paddingHorizontal: spacing.xl },
  compactCard: { width: 260, marginRight: spacing.md },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: colors.neutral.warmWhite,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    paddingTop: spacing.md,
    paddingBottom: 32,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.neutral.lightGray, alignSelf: 'center', marginBottom: spacing.lg },
  modalClose: { marginHorizontal: spacing['2xl'], marginTop: spacing.md, alignItems: 'center', paddingVertical: spacing.md },
  modalCloseText: { ...typography.bodyM, color: colors.neutral.mediumGray },
});
