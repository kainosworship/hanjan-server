import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { colors, spacing, radius, typography } from '@/theme';
import { ChatRoomHeader } from '@/components/chat/ChatRoomHeader';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { MeetingConfirmButton } from '@/components/chat/MeetingConfirmButton';
import { VenueShareButton } from '@/components/chat/VenueShareButton';
import { useTimer } from '@/hooks/useTimer';
import { useSocket } from '@/hooks/useSocket';
import { useChat } from '@/hooks/useChat';
import { useAuthStore } from '@/stores/authStore';
import { apiGet } from '@/services/apiClient';
import type { ChatMessage } from 'hanjan-shared';

interface RoomMatchUser {
  id: string;
  nickname: string;
  mannerScore?: { overallScore?: number } | null;
}

interface RoomMatch {
  requesterId: string;
  accepterId: string;
  requester: RoomMatchUser;
  accepter: RoomMatchUser;
  activity?: { category: string } | null;
}

interface ChatRoomDetail {
  id: string;
  status: string;
  timerStartedAt: string | null;
  timerExpiresAt: string | null;
  match: RoomMatch;
  messages?: ChatMessage[];
}

interface TimerUpdatePayload {
  remainingSeconds: number;
}

interface ConfirmStatusPayload {
  confirmedUsers: string[];
}

interface MeetingConfirmedPayload {
  id: string;
}

export default function ChatRoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const [roomInfo, setRoomInfo] = useState<ChatRoomDetail | null>(null);
  const [myConfirmed, setMyConfirmed] = useState(false);
  const [partnerConfirmed, setPartnerConfirmed] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [proposalVenue, setProposalVenue] = useState('');
  const [serverSeconds, setServerSeconds] = useState<number | null>(null);

  const { messages, fetchMessages, addMessage } = useChat();
  const { socket, isConnected } = useSocket();
  const { user } = useAuthStore();

  const currentUserId = user?.id ?? '';
  const currentNickname = user?.nickname ?? '나';

  const chatMessages: ChatMessage[] = messages[roomId] ?? [];

  const computedInitialSeconds = useCallback((): number => {
    if (serverSeconds !== null) return serverSeconds;
    if (roomInfo?.timerExpiresAt) {
      return Math.max(0, Math.floor((new Date(roomInfo.timerExpiresAt).getTime() - Date.now()) / 1000));
    }
    return 30 * 60;
  }, [serverSeconds, roomInfo]);

  const { seconds, isWarning, isUrgent, isExpired, reset: resetTimer } = useTimer({
    initialSeconds: computedInitialSeconds(),
    onWarning: () => Alert.alert('⚠️ 5분 남았어요!', '빨리 만남을 확정하세요!'),
    onExpired: () => Alert.alert('⏰ 시간이 초과되었어요', '채팅방이 종료됩니다.'),
  });

  useEffect(() => {
    if (!roomId) return;
    fetchMessages(roomId).catch((err) => {
      console.warn('[ChatRoom] fetchMessages failed', err);
    });
    apiGet<ChatRoomDetail>(`/chat/rooms/${roomId}`)
      .then((room) => {
        setRoomInfo(room);
        if (room.timerExpiresAt) {
          const remaining = Math.max(0, Math.floor((new Date(room.timerExpiresAt).getTime() - Date.now()) / 1000));
          resetTimer(remaining);
        }
      })
      .catch((err) => {
        console.warn('[ChatRoom] fetchRoomDetail failed', err);
        Alert.alert('오류', '채팅방 정보를 불러오지 못했습니다.');
      });
  }, [roomId]);

  useEffect(() => {
    if (serverSeconds !== null) {
      resetTimer(serverSeconds);
    }
  }, [serverSeconds]);

  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit('join_room', { roomId });

    socket.on('new_message', (msg: ChatMessage) => {
      addMessage(roomId, msg);
      flatListRef.current?.scrollToEnd({ animated: true });
    });

    socket.on('timer_update', (data: TimerUpdatePayload) => {
      setServerSeconds(data.remainingSeconds);
    });

    socket.on('timer_warning', () => {
      Alert.alert('⚠️ 5분 남았어요!', '빨리 만남을 확정하세요!');
    });

    socket.on('timer_urgent', () => {
      Alert.alert('🚨 1분 남았어요!', '지금 바로 만남을 확정하세요!');
    });

    socket.on('confirm_status', (data: ConfirmStatusPayload) => {
      setMyConfirmed(data.confirmedUsers.includes(currentUserId));
      setPartnerConfirmed(data.confirmedUsers.some((id) => id !== currentUserId));
    });

    socket.on('meeting_confirmed', (mtg: MeetingConfirmedPayload) => {
      router.push(`/matching/confirmed?meetingId=${mtg.id}`);
    });

    socket.on('timer_expired', () => {
      Alert.alert('채팅 종료', '시간이 초과되어 채팅방이 종료되었습니다.');
    });

    return () => {
      socket.off('new_message');
      socket.off('timer_update');
      socket.off('timer_warning');
      socket.off('timer_urgent');
      socket.off('confirm_status');
      socket.off('meeting_confirmed');
      socket.off('timer_expired');
    };
  }, [socket, roomId, currentUserId]);

  const handleSend = (text: string) => {
    if (!socket || !isConnected || isExpired) return;
    socket.emit('send_message', { roomId, content: text });
  };

  const handleVenueShare = (venue: { name: string; address?: string }) => {
    if (!socket || !isConnected || isExpired) return;
    socket.emit('share_venue', { roomId, venue });
  };

  const handleMeetingPropose = () => {
    setShowProposalModal(true);
  };

  const handleSendProposal = () => {
    if (!socket || !isConnected) return;
    const scheduledAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    socket.emit('propose_meeting', {
      roomId,
      scheduledAt,
      venueName: proposalVenue || '협의된 장소',
    });
    setShowProposalModal(false);
    setProposalVenue('');
  };

  const handleConfirmMeeting = () => {
    if (!socket || !isConnected) return;
    socket.emit('confirm_meeting', { roomId });
    setMyConfirmed(true);
  };

  const match = roomInfo?.match;
  const partner = match?.requesterId === currentUserId ? match?.accepter : match?.requester;
  const category = match?.activity?.category;
  const mannerScore = partner?.mannerScore?.overallScore;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <SafeAreaView edges={['top']}>
        <ChatRoomHeader
          partnerNickname={partner?.nickname ?? '매칭 상대'}
          partnerMannerScore={typeof mannerScore === 'number' ? mannerScore : undefined}
          category={category}
          seconds={seconds}
          isWarning={isWarning}
          isUrgent={isUrgent}
          isExpired={isExpired}
          onBack={() => router.back()}
        />
      </SafeAreaView>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList<ChatMessage>
          ref={flatListRef}
          data={chatMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              currentUserId={currentUserId}
              senderNickname={item.senderId === currentUserId ? currentNickname : partner?.nickname}
            />
          )}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={
            <View style={styles.emptyMessages}>
              <Text style={styles.emptyText}>대화를 시작해보세요! 👋</Text>
              <Text style={styles.emptySubtext}>30분 안에 만남을 확정해야 해요</Text>
            </View>
          }
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <ChatInput
          onSend={handleSend}
          onVenueShare={() => setShowVenueModal(true)}
          onMeetingPropose={handleMeetingPropose}
          disabled={isExpired}
        />

        <MeetingConfirmButton
          onConfirm={handleConfirmMeeting}
          myConfirmed={myConfirmed}
          partnerConfirmed={partnerConfirmed}
          disabled={isExpired}
        />

        <VenueShareButton
          open={showVenueModal}
          onClose={() => setShowVenueModal(false)}
          onShare={handleVenueShare}
        />
      </KeyboardAvoidingView>

      <Modal visible={showProposalModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowProposalModal(false)} />
        <View style={styles.proposalSheet}>
          <View style={styles.proposalHandle} />
          <Text style={styles.proposalTitle}>만남 제안하기</Text>
          <TextInput
            style={styles.proposalInput}
            value={proposalVenue}
            onChangeText={setProposalVenue}
            placeholder="만남 장소를 입력하세요 (예: 스타벅스 강남점)"
            placeholderTextColor={colors.neutral.mediumGray}
          />
          <Text style={styles.proposalNote}>* 시간은 1시간 후로 제안됩니다</Text>
          <TouchableOpacity style={styles.proposalBtn} onPress={handleSendProposal}>
            <Text style={styles.proposalBtnText}>만남 제안 보내기 🤝</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.warmWhite },
  flex: { flex: 1 },
  messagesList: { paddingVertical: spacing.md, paddingBottom: spacing.lg },
  emptyMessages: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing['3xl'] },
  emptyText: { ...typography.bodyL, color: colors.neutral.charcoal, textAlign: 'center', marginBottom: spacing.xs },
  emptySubtext: { ...typography.bodyS, color: colors.neutral.mediumGray, textAlign: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  proposalSheet: {
    backgroundColor: colors.neutral.pureWhite,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    padding: spacing['2xl'],
    paddingBottom: 40,
  },
  proposalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.neutral.lightGray, alignSelf: 'center', marginBottom: spacing.lg },
  proposalTitle: { ...typography.h2, color: colors.neutral.charcoal, marginBottom: spacing.lg },
  proposalInput: {
    backgroundColor: colors.neutral.warmWhite,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.neutral.lightGray,
    padding: spacing.lg,
    ...typography.bodyL,
    color: colors.neutral.charcoal,
    marginBottom: spacing.sm,
  },
  proposalNote: { ...typography.caption, color: colors.neutral.mediumGray, marginBottom: spacing.xl },
  proposalBtn: {
    backgroundColor: colors.primary.coral,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  proposalBtnText: { ...typography.buttonL, color: colors.neutral.pureWhite },
});
