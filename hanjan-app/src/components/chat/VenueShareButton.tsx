import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme';

const SUGGESTED_VENUES = [
  { name: '근처 카페', emoji: '☕', description: '아늑한 카페에서 대화' },
  { name: '편의점 앞 벤치', emoji: '🪑', description: '가볍게 만나기 좋은 장소' },
  { name: '공원', emoji: '🌳', description: '산책하며 이야기' },
  { name: '패스트푸드점', emoji: '🍔', description: '편하고 가벼운 만남' },
];

interface VenueData {
  name: string;
  address?: string;
}

interface Props {
  onShare: (venue: VenueData) => void;
  open?: boolean;
  onClose?: () => void;
}

export function VenueShareButton({ onShare, open, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const isControlled = open !== undefined;
  const isVisible = isControlled ? open : visible;

  const close = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setVisible(false);
    }
  };
  const [custom, setCustom] = useState('');

  const handleSelect = (venue: VenueData) => {
    onShare(venue);
    close();
  };

  const handleCustomShare = () => {
    if (!custom.trim()) return;
    onShare({ name: custom.trim() });
    setCustom('');
    close();
  };

  return (
    <>
      {!isControlled && (
        <TouchableOpacity style={styles.btn} onPress={() => setVisible(true)} activeOpacity={0.8}>
          <Text style={styles.btnText}>📍 장소 추천</Text>
        </TouchableOpacity>
      )}

      <Modal visible={isVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.backdrop} onPress={close} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>만남 장소 추천</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {SUGGESTED_VENUES.map((v) => (
              <TouchableOpacity
                key={v.name}
                style={styles.venueItem}
                onPress={() => handleSelect({ name: v.name })}
                activeOpacity={0.8}
              >
                <Text style={styles.venueEmoji}>{v.emoji}</Text>
                <View style={styles.venueInfo}>
                  <Text style={styles.venueName}>{v.name}</Text>
                  <Text style={styles.venueDesc}>{v.description}</Text>
                </View>
                <Text style={styles.shareIcon}>공유</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.customSection}>
              <Text style={styles.customLabel}>직접 입력</Text>
              <View style={styles.customRow}>
                <TextInput
                  style={styles.customInput}
                  value={custom}
                  onChangeText={setCustom}
                  placeholder="장소 이름을 입력하세요"
                  placeholderTextColor={colors.neutral.mediumGray}
                />
                <TouchableOpacity
                  style={[styles.customBtn, !custom.trim() && styles.customBtnDisabled]}
                  onPress={handleCustomShare}
                  disabled={!custom.trim()}
                >
                  <Text style={styles.customBtnText}>공유</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.neutral.warmWhite,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
  },
  btnText: { fontSize: 13, color: colors.neutral.darkGray, fontWeight: '500' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: colors.neutral.pureWhite,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    padding: spacing['2xl'],
    paddingBottom: 40,
    maxHeight: '70%',
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.neutral.lightGray, alignSelf: 'center', marginBottom: spacing.lg },
  sheetTitle: { ...typography.h2, color: colors.neutral.charcoal, marginBottom: spacing.lg },
  venueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGray,
  },
  venueEmoji: { fontSize: 28, width: 40, textAlign: 'center' },
  venueInfo: { flex: 1 },
  venueName: { ...typography.bodyM, color: colors.neutral.charcoal, fontWeight: '600' },
  venueDesc: { ...typography.bodyS, color: colors.neutral.mediumGray },
  shareIcon: { ...typography.buttonS, color: colors.primary.coral },
  customSection: { marginTop: spacing.xl },
  customLabel: { ...typography.bodyM, color: colors.neutral.charcoal, fontWeight: '600', marginBottom: spacing.sm },
  customRow: { flexDirection: 'row', gap: spacing.sm },
  customInput: {
    flex: 1,
    backgroundColor: colors.neutral.warmWhite,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.bodyM,
    color: colors.neutral.charcoal,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
  },
  customBtn: {
    backgroundColor: colors.primary.coral,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    justifyContent: 'center',
  },
  customBtnDisabled: { backgroundColor: colors.neutral.lightGray },
  customBtnText: { ...typography.buttonM, color: colors.neutral.pureWhite },
});
