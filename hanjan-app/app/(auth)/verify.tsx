import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Container } from '../../src/components/common/Container';
import { Typography } from '../../src/components/common/Typography';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { theme } from '../../src/theme';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function VerifyScreen() {
    const router = useRouter();
    const { phone } = useLocalSearchParams();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleVerify = async () => {
        if (otp.length < 6) return;

        setLoading(true);
        try {
            // Simulate API call
            // const res = await api.post('/auth/verify-otp', { phone, otp });
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock result
            const mockResult = {
                user: {
                    id: 'user-123',
                    phone: phone as string,
                    nickname: '',
                    isIdVerified: false,
                    isSelfieVerified: false
                },
                token: 'fake-jwt-token',
                isNewUser: true
            };

            setAuth(mockResult.user, mockResult.token);

            if (mockResult.isNewUser) {
                router.push('/(auth)/onboarding');
            } else {
                router.replace('/(tabs)');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <View style={styles.header}>
                    <Typography variant="h1">
                        인증번호를 입력해주세요
                    </Typography>
                    <Typography variant="bodyM" color={theme.colors.neutral.darkGray} style={styles.subtitle}>
                        {phone}번으로 전송된 6자리 번호를 입력하세요.
                    </Typography>
                </View>

                <View style={styles.form}>
                    <Input
                        placeholder="000000"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="numeric"
                        inputStyle={styles.otpInput}
                    />
                    <Button
                        title="인증번호 재전송"
                        variant="ghost"
                        onPress={() => { }}
                        size="sm"
                    />
                </View>

                <View style={styles.footer}>
                    <Button
                        title="확인"
                        onPress={handleVerify}
                        loading={loading}
                        disabled={otp.length < 6}
                    />
                </View>
            </KeyboardAvoidingView>
        </Container>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    header: {
        marginTop: 60,
        marginBottom: 40,
    },
    subtitle: {
        marginTop: theme.spacing.xs,
    },
    form: {
        flex: 1,
        alignItems: 'center',
    },
    otpInput: {
        fontSize: 32,
        textAlign: 'center',
        letterSpacing: 10,
        width: '100%',
        backgroundColor: 'transparent',
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary.coral,
        borderRadius: 0,
    },
    footer: {
        paddingBottom: 20,
    },
});
