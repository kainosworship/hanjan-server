import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle
} from 'react-native';
import { theme } from '../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    style,
    textStyle,
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary':
                return { backgroundColor: theme.colors.secondary.amber };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: theme.colors.primary.coral
                };
            case 'ghost':
                return { backgroundColor: 'transparent' };
            default:
                return { backgroundColor: theme.colors.primary.coral };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return { paddingVertical: theme.spacing.xxs, paddingHorizontal: theme.spacing.md };
            case 'lg':
                return { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl };
            default:
                return { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg };
        }
    };

    const getTextColor = () => {
        if (variant === 'outline' || variant === 'ghost') return theme.colors.primary.coral;
        return theme.colors.neutral.pureWhite;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.base,
                getVariantStyles(),
                getSizeStyles(),
                disabled && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[
                    styles.text,
                    { color: getTextColor() },
                    variant === 'outline' && { color: theme.colors.primary.coral },
                    textStyle
                ]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: theme.typography.buttonM.size,
        fontWeight: theme.typography.buttonM.weight as any,
    },
    disabled: {
        opacity: 0.5,
    },
});
