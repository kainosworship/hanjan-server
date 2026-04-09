import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, radius, spacing } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  onPress,
  label,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const containerStyle: ViewStyle[] = [styles.base, styles[variant], styles[`size_${size}`]];
  if (disabled || loading) containerStyle.push(styles.disabled);
  if (style) containerStyle.push(style);

  const textStyle: TextStyle[] = [styles.text, styles[`text_${variant}`], styles[`textSize_${size}`]];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.neutral.pureWhite : colors.primary.coral} />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary.coral },
  secondary: { backgroundColor: colors.primary.light },
  ghost: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.neutral.lightGray },
  danger: { backgroundColor: colors.semantic.error },
  disabled: { backgroundColor: colors.neutral.lightGray },
  size_lg: { height: 52, paddingHorizontal: spacing['2xl'] },
  size_md: { height: 44, paddingHorizontal: spacing.xl },
  size_sm: { height: 36, paddingHorizontal: spacing.lg },
  text: { fontWeight: '600' },
  text_primary: { color: colors.neutral.pureWhite },
  text_secondary: { color: colors.primary.coral },
  text_ghost: { color: colors.neutral.darkGray },
  text_danger: { color: colors.neutral.pureWhite },
  textSize_lg: { fontSize: 16, lineHeight: 20 },
  textSize_md: { fontSize: 14, lineHeight: 18 },
  textSize_sm: { fontSize: 12, lineHeight: 16 },
});
