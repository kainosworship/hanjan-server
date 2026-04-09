import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { colors, typography, radius, spacing } from '@/theme';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  containerStyle?: ViewStyle;
}

export function TextInput({
  label,
  helperText,
  error,
  success,
  containerStyle,
  ...props
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? colors.semantic.error
    : success
    ? colors.semantic.success
    : isFocused
    ? colors.primary.coral
    : colors.neutral.lightGray;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, { borderColor }]}>
        <RNTextInput
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.neutral.mediumGray}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  label: { ...typography.caption, color: colors.neutral.darkGray },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    backgroundColor: colors.neutral.pureWhite,
    height: 48,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  input: { ...typography.bodyM, color: colors.neutral.charcoal },
  errorText: { ...typography.caption, color: colors.semantic.error },
  helperText: { ...typography.caption, color: colors.neutral.mediumGray },
});
