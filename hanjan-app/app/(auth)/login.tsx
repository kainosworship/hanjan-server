import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../../src/components/common/Container';
import { Typography } from '../../src/components/common/Typography';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { theme } from '../../src/theme';

export default function LoginScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        if (phone.length < 10) return;

        setLoading(true);
        try {
            // In real app: await api.post('/auth/send-otp', { phone });
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push({
                pathname: '/(auth)/verify',
                params: { phone }
            });
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
                    <Typography variant="display" color={theme.colors.primary.coral}>
                        🍷 한잔
                    </Typography>
                    <Typography variant="h2" style={styles.title}>
                        번호로 시작하기
                    </Typography>
                    <Typography variant="bodyM" color={theme.colors.neutral.darkGray}>
                        안전한 만남을 위해 본인 인증이 필요해요.
                    </Typography>
                </View>

                <View style={styles.form}>
                    <Input
                        label="휴대폰 번호"
                        placeholder="010-0000-0000"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.footer}>
                    <Button
                        title="인증번호 받기"
                        onPress={handleSendOtp}
                        loading={loading}
                        disabled={phone.length < 10}
                    />
                    <Typography variant="caption" align="center" style={styles.terms}>
                        계속 진행하면 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
                    </Typography>
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
    title: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs,
    },
    form: {
        flex: 1,
    },
    footer: {
        paddingBottom: 20,
    },
    terms: {
        marginTop: theme.spacing.md,
        color: theme.colors.neutral.mediumGray,
    },
});
