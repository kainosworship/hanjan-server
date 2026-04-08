import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { Container } from '../../src/components/common/Container';
import { Typography } from '../../src/components/common/Typography';
import { Button } from '../../src/components/common/Button';
import { theme } from '../../src/theme';
import { Copy, ShareNetwork, CheckCircle, Clock } from 'phosphor-react-native';

export default function ReferralScreen() {
    const [invitedCount, setInvitedCount] = useState(2);
    const myCode = 'CHRIS-HJ-7K2M';

    const onShare = async () => {
        try {
            await Share.share({
                message: `🍷 한잔에서 함께 할 사람을 찾아보세요! 제 초대코드 [${myCode}]로 가입하면 혜택이 있어요! https://hanjan.app/invite/${myCode}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const renderFriendItem = (name: string, status: 'completed' | 'pending') => (
        <View style={styles.friendCard}>
            <View style={styles.friendLeft}>
                <View style={styles.avatarPlaceholder}>
                    <Typography color="white">{name[0]}</Typography>
                </View>
                <Typography variant="bodyM">{name}</Typography>
            </View>
            <View style={styles.statusBadge}>
                {status === 'completed' ? (
                    <>
                        <CheckCircle size={16} color={theme.colors.semantic.success} weight="fill" />
                        <Typography variant="caption" color={theme.colors.semantic.success}>가입 완료</Typography>
                    </>
                ) : (
                    <>
                        <Clock size={16} color={theme.colors.neutral.mediumGray} weight="fill" />
                        <Typography variant="caption" color={theme.colors.neutral.mediumGray}>가입 대기</Typography>
                    </>
                )}
            </View>
        </View>
    );

    return (
        <Container>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <View style={styles.hero}>
                    <Typography variant="display" align="center" style={styles.heroEmoji}>🎁</Typography>
                    <Typography variant="h1" align="center">친구 3명 초대하면</Typography>
                    <Typography variant="h1" align="center" color={theme.colors.primary.coral}>Plus 1개월 무료!</Typography>
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Typography variant="h3">현재 초대 현황</Typography>
                        <Typography variant="h3" color={theme.colors.primary.coral}>{invitedCount}/3명 달성</Typography>
                    </View>

                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${(invitedCount / 3) * 100}%` }]} />
                    </View>

                    <View style={styles.steps}>
                        <View style={styles.step}>
                            <CheckCircle size={24} color={invitedCount >= 1 ? theme.colors.primary.coral : theme.colors.neutral.lightGray} weight="fill" />
                            <Typography variant="overline">1명</Typography>
                        </View>
                        <View style={styles.step}>
                            <CheckCircle size={24} color={invitedCount >= 2 ? theme.colors.primary.coral : theme.colors.neutral.lightGray} weight="fill" />
                            <Typography variant="overline">2명</Typography>
                        </View>
                        <View style={styles.step}>
                            <CheckCircle size={24} color={invitedCount >= 3 ? theme.colors.primary.coral : theme.colors.neutral.lightGray} weight="fill" />
                            <Typography variant="overline">3명 달성!</Typography>
                        </View>
                    </View>
                </View>

                <View style={styles.codeSection}>
                    <Typography variant="bodyS" color={theme.colors.neutral.darkGray} style={styles.label}>내 초대 코드</Typography>
                    <TouchableOpacity style={styles.codeBox}>
                        <Typography variant="h3">{myCode}</Typography>
                        <Copy size={20} color={theme.colors.primary.coral} />
                    </TouchableOpacity>
                    <Button
                        title="친구에게 공유하기"
                        onPress={onShare}
                        style={styles.shareBtn}
                    />
                </View>

                <View style={styles.historySection}>
                    <Typography variant="h3" style={styles.sectionTitle}>초대 기록</Typography>
                    {renderFriendItem('지수현', 'completed')}
                    {renderFriendItem('김민수', 'completed')}
                    {renderFriendItem('박서준', 'pending')}
                </View>

                <View style={styles.infoBox}>
                    <Typography variant="caption" color={theme.colors.neutral.mediumGray}>
                        • 친구가 가입 후 신원 인증(신분증+셀피)을 완료해야 초대로 인정됩니다.
                    </Typography>
                    <Typography variant="caption" color={theme.colors.neutral.mediumGray}>
                        • 3명 달성마다 자동으로 Plus 1개월 혜택이 추가됩니다.
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
    hero: {
        marginBottom: theme.spacing.xxl,
    },
    heroEmoji: {
        fontSize: 64,
        marginBottom: theme.spacing.sm,
    },
    progressContainer: {
        backgroundColor: theme.colors.neutral.lightGray,
        padding: theme.spacing.lg,
        borderRadius: theme.radius.lg,
        marginBottom: theme.spacing.xl,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    progressBarBg: {
        height: 12,
        backgroundColor: 'white',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: theme.spacing.sm,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.primary.coral,
    },
    steps: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing.xs,
    },
    step: {
        alignItems: 'center',
        gap: 4,
    },
    codeSection: {
        marginBottom: theme.spacing.xl,
    },
    label: {
        marginBottom: theme.spacing.xs,
    },
    codeBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.neutral.lightGray,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.md,
    },
    shareBtn: {
        borderRadius: theme.radius.full,
    },
    historySection: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        marginBottom: theme.spacing.md,
    },
    friendCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.neutral.lightGray,
    },
    friendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.neutral.mediumGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoBox: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.neutral.warmWhite,
        borderRadius: theme.radius.md,
        gap: 4,
    },
});
