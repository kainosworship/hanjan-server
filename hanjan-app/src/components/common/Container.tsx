import React from 'react';
import { View, StyleSheet, ViewStyle, SafeAreaView, StatusBar } from 'react-native';
import { theme } from '../theme';

interface ContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
    useSafeArea?: boolean;
    backgroundColor?: string;
}

export const Container: React.FC<ContainerProps> = ({
    children,
    style,
    useSafeArea = true,
    backgroundColor = theme.colors.neutral.pureWhite,
}) => {
    const Wrapper = useSafeArea ? SafeAreaView : View;

    return (
        <Wrapper style={[styles.container, { backgroundColor }, style]}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.content}>{children}</View>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },
});
