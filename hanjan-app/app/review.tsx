import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Container } from '../../src/components/common/Container';
import { Typography } from '../../src/components/common/Typography';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { theme } from '../../src/theme';
import { Star } from 'phosphor-react-native';

export default function ReviewScreen() {
    const { meetingId, name } = useLocalSearchParams();
    const router = useRouter();

    const [scores, setScores] = useState({
        conversation: 0,
        punctuality: 0,
        remeet: 0,
    });
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReview = (type: keyof typeof scores, val: number) => {
        setScores({ ...scores, [type]: val });
    };

    const handleSubmit = async () => {
        if (Object.values(scores).some(v => v === 0)) return;

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.replace('/(tabs)');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (type: keyof typeof scores) => (
        <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map(val => (
                <TouchableOpacity key={val} onPress={() => handleReview(type, val)}>
                    <Star
                        size={36}
                        color={val <= scores[type] ? theme.colors.primary.amber : theme.colors.neutral.lightGray}
                        weight={val <= scores[type] ? 'fill' : 'regular'}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <Container>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Typography variant="display" align="center">🍷</Typography>
                    <Typography variant="h1" align="center" style={styles.title}>
                        {name}님과의 만남은 어땠나요?
                    </Typography>
                    <Typography variant="bodyM" align="center" color={theme.colors.neutral.darkGray}>
                        매너 있는 후기는 더 좋은 만남을 만들어요.
                    </Typography>
                </View>

                <View style={styles.section}>
                    <Typography variant="h3">1. 대화 매너</Typography>
                    <Typography variant="caption" color={theme.colors.neutral.mediumGray}>배려 있고 즐겁게 대화했나요?</Typography>
                    {renderStars('conversation')}
                </View>

                <View style={styles.section}>
                    <Typography variant="h3">2. 시간 약속</Typography>
                    <Typography variant="caption" color={theme.colors.neutral.mediumGray}>약속 시간을 잘 지켰나요?</Typography>
                    {renderStars('punctuality')}
                </View>

                <View style={styles.section}>
                    <Typography variant="h3">3. 다시 만나고 싶나요?</Typography>
                    <Typography variant="caption" color={theme.colors.neutral.mediumGray}>다음에 또 만나고 싶은 분인가요?</Typography>
                    {renderStars('remeet')}
                </View>

                <View style={styles.section}>
                    <Typography variant="h3">한 줄 후기 (선택)</Typography>
                    <Input
                        placeholder="대화가 정말 편안했어요!"
                        value={comment}
                        onChangeText={setComment}
                        containerStyle={{ marginTop: 8 }}
                    />
                </View>

                <View style={styles.footer}>
                    <Button
                        title="평가 완료 ✅"
                        onPress={handleSubmit}
                        loading={loading}
                        disabled={Object.values(scores).some(v => v === 0)}
                    />
                    <Typography variant="caption" align="center" style={styles.info}>
                        양측 평가가 완료되면 연락처 교환이 가능해집니다.
                    </Typography>
                </View>
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    scroll: {
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs,
    },
    section: {
        marginBottom: 32,
    },
    starRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    footer: {
        marginTop: 20,
    },
    info: {
        marginTop: 12,
        color: theme.colors.neutral.mediumGray,
    },
});
