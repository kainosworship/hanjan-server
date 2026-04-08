import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { theme } from '../theme';

type TypographyVariant = keyof typeof theme.typography;

interface TypographyProps {
    variant?: TypographyVariant;
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    children: React.ReactNode;
    style?: TextStyle;
}

export const Typography: React.FC<TypographyProps> = ({
    variant = 'bodyM',
    color = theme.colors.neutral.charcoal,
    align = 'left',
    children,
    style,
}) => {
    const variantStyle = theme.typography[variant];

    return (
        <Text
            style={[
                {
                    fontSize: variantStyle.size,
                    fontWeight: variantStyle.weight as any,
                    lineHeight: variantStyle.lineHeight,
                    color,
                    textAlign: align,
                },
                style,
            ]}
        >
            {children}
        </Text>
    );
};
