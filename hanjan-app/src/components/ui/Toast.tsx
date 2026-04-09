import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, radius, spacing, shadows } from '@/theme';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export function Toast({ message, type = 'info', visible, onHide, duration = 3000 }: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      const timer = setTimeout(() => {
        Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }).start(() => onHide());
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const bgColor = {
    success: colors.semantic.success,
    error: colors.semantic.error,
    info: colors.neutral.charcoal,
  }[type];

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: bgColor, top: insets.top + spacing.md, transform: [{ translateY }] },
        shadows.md,
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing['2xl'],
    right: spacing['2xl'],
    borderRadius: radius.lg,
    padding: spacing.md,
    zIndex: 9999,
  },
  message: { ...typography.bodyS, color: colors.neutral.pureWhite, textAlign: 'center' },
});
