import React from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle
} from 'react-native';
import { theme } from '../../theme';

interface InputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    secureTextEntry,
    keyboardType = 'default',
    containerStyle,
    inputStyle,
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.neutral.mediumGray}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                    inputStyle,
                ]}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: theme.typography.bodyS.size,
        color: theme.colors.neutral.darkGray,
        marginBottom: theme.spacing.xxs,
        fontWeight: '600',
    },
    input: {
        backgroundColor: theme.colors.neutral.lightGray,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        fontSize: theme.typography.bodyM.size,
        color: theme.colors.neutral.charcoal,
    },
    inputError: {
        borderWidth: 1,
        borderColor: theme.colors.semantic.error,
    },
    errorText: {
        color: theme.colors.semantic.error,
        fontSize: theme.typography.caption.size,
        marginTop: theme.spacing.xxs,
    },
});
