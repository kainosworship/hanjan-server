import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '@/theme';

interface Props {
  onSend: (text: string) => void;
  onVenueShare?: () => void;
  onMeetingPropose?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onVenueShare,
  onMeetingPropose,
  disabled = false,
  placeholder = '메시지를 입력하세요...',
}: Props) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        {onVenueShare && (
          <TouchableOpacity style={styles.actionBtn} onPress={onVenueShare} disabled={disabled}>
            <Text style={styles.actionBtnText}>📍 장소</Text>
          </TouchableOpacity>
        )}
        {onMeetingPropose && (
          <TouchableOpacity style={styles.actionBtn} onPress={onMeetingPropose} disabled={disabled}>
            <Text style={styles.actionBtnText}>📅 시간</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.inputRow, disabled && styles.disabledRow]}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={disabled ? '채팅이 종료되었습니다' : placeholder}
          placeholderTextColor={colors.neutral.mediumGray}
          multiline
          maxLength={500}
          editable={!disabled}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!text.trim() || disabled) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!text.trim() || disabled}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.pureWhite,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.lightGray,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    paddingBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  actionBtn: {
    backgroundColor: colors.neutral.warmWhite,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
  },
  actionBtnText: { fontSize: 13, color: colors.neutral.darkGray, fontWeight: '500' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.neutral.warmWhite,
    borderRadius: radius['2xl'],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  disabledRow: { backgroundColor: colors.neutral.lightGray },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.neutral.charcoal,
    maxHeight: 100,
    paddingVertical: spacing.xs,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: colors.neutral.lightGray },
  sendIcon: { color: colors.neutral.pureWhite, fontSize: 14, fontWeight: '700' },
});
