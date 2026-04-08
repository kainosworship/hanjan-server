import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../../src/components/common/Container';
import { Typography } from '../../src/components/common/Typography';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { theme } from '../../src/theme';
import { X } from 'phosphor-react-native';

const CATEGORIES = [
    { id: 'COFFEE', label: '커피', icon: '☕', color: theme.colors.categories.coffee },
    { id: 'MEAL', label: '식사', icon: '🍽️', color: theme.colors.categories.meal },
    { id: 'DRINK', label: '술', icon: '🍷', color: theme.colors.categories.drink },
    { id: 'WALK', label: '산책', icon: '🚶', color: theme.colors.categories.walk },
    { id: 'CULTURE', label: '문화', icon: '🎨', color: theme.colors.categories.culture },
    { id: 'ANYTHING', label: '뭐든', icon: '🎲', color: theme.colors.categories.anything },
];

const TIMINGS = [
    { id: 'NOW', label: '지금 즉시' },
    { id: 'THIRTY_MIN', label: '30분 후' },
    { id: 'ONE_HOUR', label: '1시간 후' },
    { id: 'TONIGHT', label: '오늘 저녁' },
];

export default function CreateActivityScreen() {
    const router = useRouter();
    const [category, setCategory] = useState<string | null>(null);
    const [timing, setTiming] = useState<string>('NOW');
    const [radius, setRadius] = useState<number>(2);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!category) return;

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.back();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container useSafeArea={true}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <X size={24} color={theme.colors.neutral.charcoal} />
                </TouchableOpacity>
                <Typography variant="h2">활동 만들기</Typography>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Typography variant="h3" style={styles.sectionTitle}>오늘 뭐 하고 싶어요?</Typography>
                <View style={styles.categoryGrid}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.categoryCard,
                                category === cat.id && { backgroundColor: theme.colors.primary.light, borderColor: theme.colors.primary.coral }
                            ]}
                            onPress={() => setCategory(cat.id)}
                        >
                            <Typography variant="display">{cat.icon}</Typography>
                            <Typography variant="caption" style={{ marginTop: 4 }}>{cat.label}</Typography>
                        </TouchableOpacity>
                    ))}
                </View>

                <Typography variant="h3" style={styles.sectionTitle}>언제?</Typography>
                <View style={styles.row}>
                    {TIMINGS.map(t => (
                        <TouchableOpacity
                            key={t.id}
                            style={[styles.chip, timing === t.id && styles.chipActive]}
                            onPress={() => setTiming(t.id)}
                        >
                            <Typography variant="caption" color={timing === t.id ? 'white' : theme.colors.neutral.darkGray}>
                                {t.label}
                            </Typography>
                        </TouchableOpacity>
                    ))}
                </View>

                <Typography variant="h3" style={styles.sectionTitle}>어디서? (반경)</Typography>
                <View style={styles.row}>
                    {[1, 2, 5].map(r => (
                        <TouchableOpacity
                            key={r}
                            style={[styles.chip, radius === r && styles.chipActive]}
                            onPress={() => setRadius(r)}
                        >
                            <Typography variant="caption" color={radius === r ? 'white' : theme.colors.neutral.darkGray}>
                                {r}km
                            </Typography>
                        </TouchableOpacity>
                    ))}
                </View>

                <Typography variant="h3" style={styles.sectionTitle}>한 마디 (선택)</Typography>
                <Input
                    placeholder="오늘 좀 지쳤는데 수다 떨 사람 구함"
                    value={message}
                    onChangeText={setMessage}
                    inputStyle={styles.memoInput}
                />

                <View style={styles.footer}>
                    <Button
                        title="활동 올리기 🎯"
                        onPress={handleCreate}
                        loading={loading}
                        disabled={!category}
                    />
                </View>
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
    },
    scroll: {
        paddingBottom: 40,
    },
    sectionTitle: {
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md,
    },
    categoryCard: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: theme.colors.neutral.lightGray,
        borderRadius: theme.radius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    row: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    chip: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.neutral.lightGray,
        borderRadius: theme.radius.full,
    },
    chipActive: {
        backgroundColor: theme.colors.primary.coral,
    },
    memoInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    footer: {
        marginTop: theme.spacing.xxl,
    },
});
