import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Container } from '../../src/components/common/Container';
import { Typography } from '../../src/components/common/Typography';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { theme } from '../../src/theme';
import { CaretLeft, MapPin, Calendar, PaperPlaneTilt } from 'phosphor-react-native';
import { format, differenceInSeconds } from 'date-fns';

export default function ChatScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState('');
    const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 min in seconds
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        // Start timer
        const interval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // Mock initial messages
        setMessages([
            { id: '1', senderId: 'other', content: '안녕하세요! 성수동 어디가 좋을까요? 😊', createdAt: new Date() },
        ]);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSend = () => {
        if (!text.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            senderId: 'me',
            content: text,
            createdAt: new Date(),
        };

        setMessages([...messages, newMessage]);
        setText('');
        Keyboard.dismiss();
        setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    };

    const renderMessage = ({ item }: { item: any }) => (
        <View style={[
            styles.messageWrapper,
            item.senderId === 'me' ? styles.myMessageWrapper : styles.otherMessageWrapper
        ]}>
            <View style={[
                styles.messageBubble,
                item.senderId === 'me' ? styles.myBubble : styles.otherBubble
            ]}>
                <Typography
                    color={item.senderId === 'me' ? 'white' : theme.colors.neutral.charcoal}
                    variant="bodyM"
                >
                    {item.content}
                </Typography>
            </View>
            <Typography variant="overline" color={theme.colors.neutral.mediumGray}>
                {format(item.createdAt, 'HH:mm')}
            </Typography>
        </View>
    );

    return (
        <Container useSafeArea={true}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <CaretLeft size={24} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Typography variant="h3">제이크</Typography>
                    <Typography variant="caption" color={theme.colors.semantic.error}>
                        ⏱️ 남은 시간: {formatTime(timeLeft)}
                    </Typography>
                </View>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.actionToolbar}>
                    <TouchableOpacity style={styles.toolBtn}>
                        <MapPin size={20} color={theme.colors.neutral.darkGray} />
                        <Typography variant="caption">장소 공유</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toolBtn}>
                        <Calendar size={20} color={theme.colors.neutral.darkGray} />
                        <Typography variant="caption">시간 제안</Typography>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputRow}>
                    <Input
                        value={text}
                        onChangeText={setText}
                        placeholder="메시지를 입력하세요"
                        containerStyle={styles.textInputContainer}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
                        onPress={handleSend}
                        disabled={!text.trim()}
                    >
                        <PaperPlaneTilt size={24} color="white" weight="fill" />
                    </TouchableOpacity>
                </View>

                <View style={styles.confirmSection}>
                    <Button
                        title="🤝 만남 확정하기"
                        onPress={() => { }}
                        style={styles.confirmBtn}
                    />
                </View>
            </KeyboardAvoidingView>
        </Container>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.neutral.lightGray,
    },
    headerCenter: {
        alignItems: 'center',
    },
    list: {
        padding: theme.spacing.lg,
        paddingBottom: 20,
    },
    messageWrapper: {
        marginBottom: theme.spacing.md,
        maxWidth: '80%',
    },
    myMessageWrapper: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    otherMessageWrapper: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    messageBubble: {
        padding: theme.spacing.md,
        borderRadius: theme.radius.lg,
        marginBottom: 4,
    },
    myBubble: {
        backgroundColor: theme.colors.primary.coral,
        borderBottomRightRadius: 2,
    },
    otherBubble: {
        backgroundColor: theme.colors.neutral.lightGray,
        borderBottomLeftRadius: 2,
    },
    actionToolbar: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        gap: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.neutral.lightGray,
    },
    toolBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: theme.colors.neutral.lightGray,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.radius.sm,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.sm,
    },
    textInputContainer: {
        flex: 1,
        marginBottom: 0,
    },
    sendBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary.coral,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: theme.colors.neutral.mediumGray,
    },
    confirmSection: {
        padding: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
    },
    confirmBtn: {
        borderRadius: theme.radius.full,
    },
});
