import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Container } from '../../src/components/common/Container';
import { Typography } from '../../src/components/common/Typography';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { theme } from '../../src/theme';

export default function OnboardingScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);

    // Form State
    const [nickname, setNickname] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
    const [selfie, setSelfie] = useState<string | null>(null);
    const [referralCode, setReferralCode] = useState('');
    const [loading, setLoading] = useState(false);

    const takeSelfie = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelfie(result.assets[0].uri);
        }
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            // Simulate API call to update profile
            await new Promise(resolve => setTimeout(resolve, 2000));
            router.replace('/(tabs)');
        } catch (error) {
            Alert.alert('오류', '프로필 저장 중 문제가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.stepContainer}>
                        <Typography variant="h1" style={styles.title}>당신을 알려주세요</Typography>
                        <Typography variant="bodyM" color={theme.colors.neutral.darkGray} style={styles.subtitle}>
                            앱에서 보여질 기본 정보를 입력해주세요.
                        </Typography>
                        <Input label="닉네임" value={nickname} onChangeText={setNickname} placeholder="닉네임을 입력하세요" />
                        <Input label="생년월일" value={birthDate} onChangeText={setBirthDate} placeholder="1995.01.01" keyboardType="numeric" />

                        <Typography variant="bodyS" style={styles.label}>성별</Typography>
                        <View style={styles.row}>
                            {['male', 'female', 'other'].map((g) => (
                                <Button
                                    key={g}
                                    title={g === 'male' ? '남성' : g === 'female' ? '여성' : '기타'}
                                    variant={gender === g ? 'primary' : 'outline'}
                                    onPress={() => setGender(g as any)}
                                    style={styles.genderBtn}
                                />
                            ))}
                        </View>
                        <View style={styles.spacer} />
                        <Button title="다음" onPress={() => setStep(2)} disabled={!nickname || !birthDate || !gender} />
                    </View>
                );
            case 2:
                return (
                    <View style={styles.stepContainer}>
                        <Typography variant="h1" style={styles.title}>실시간 셀피 촬영 📸</Typography>
                        <Typography variant="bodyM" color={theme.colors.neutral.darkGray} style={styles.subtitle}>
                            한잔은 실제 만남을 위해 실시간 셀피만 허용해요.
                        </Typography>

                        <View style={styles.selfieContainer}>
                            {selfie ? (
                                <Image source={{ uri: selfie }} style={styles.selfie} />
                            ) : (
                                <View style={styles.selfiePlaceholder}>
                                    <Typography variant="caption" color={theme.colors.neutral.mediumGray}>카메라로 촬영해주세요</Typography>
                                </View>
                            )}
                        </View>

                        <Button
                            title={selfie ? "다시 촬영" : "셀피 촬영하기"}
                            variant="outline"
                            onPress={takeSelfie}
                            style={styles.actionBtn}
                        />

                        <View style={styles.spacer} />
                        <View style={styles.row}>
                            <Button title="이전" variant="ghost" onPress={() => setStep(1)} style={styles.flex1} />
                            <Button title="다음" onPress={() => setStep(3)} disabled={!selfie} style={styles.flex1} />
                        </View>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.stepContainer}>
                        <Typography variant="h1" style={styles.title}>추천인 코드 (선택)</Typography>
                        <Typography variant="bodyM" color={theme.colors.neutral.darkGray} style={styles.subtitle}>
                            친구가 준 코드가 있나요? 코드를 입력하면 혜택이 있을 수 있어요.
                        </Typography>
                        <Input label="초대 코드" value={referralCode} onChangeText={setReferralCode} placeholder="HJ-XXXXXXX" />

                        <View style={styles.spacer} />
                        <View style={styles.row}>
                            <Button title="이전" variant="ghost" onPress={() => setStep(2)} style={styles.flex1} />
                            <Button title="가입 완료 ✨" onPress={handleFinish} loading={loading} style={styles.flex1} />
                        </View>
                    </View>
                );
        }
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderStep()}
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingTop: 40,
        paddingBottom: 20,
    },
    stepContainer: {
        flex: 1,
    },
    title: {
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        marginBottom: theme.spacing.xl,
    },
    label: {
        marginBottom: theme.spacing.xs,
        fontWeight: '600',
        color: theme.colors.neutral.darkGray,
    },
    row: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    genderBtn: {
        flex: 1,
    },
    spacer: {
        flex: 1,
        minHeight: 40,
    },
    selfieContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: theme.colors.neutral.lightGray,
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        marginBottom: theme.spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selfie: {
        width: '100%',
        height: '100%',
    },
    selfiePlaceholder: {
        alignItems: 'center',
    },
    actionBtn: {
        marginBottom: theme.spacing.md,
    },
    flex1: {
        flex: 1,
    },
});
