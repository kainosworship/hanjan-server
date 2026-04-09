import { apiGet } from '@/services/apiClient';
import { useChatStore } from '@/stores/chatStore';
import type { ChatRoom, ChatMessage } from '@/shared';

export function useChat() {
  const { rooms, messages, setRooms, setMessages, addMessage } = useChatStore();

  const fetchRooms = async (): Promise<ChatRoom[]> => {
    const roomList = await apiGet<ChatRoom[]>('/chat/rooms');
    setRooms(roomList);
    return roomList;
  };

  const fetchMessages = async (roomId: string): Promise<ChatMessage[]> => {
    const msgs = await apiGet<ChatMessage[]>(`/chat/rooms/${roomId}/messages`);
    setMessages(roomId, msgs);
    return msgs;
  };

  return { rooms, messages, fetchRooms, fetchMessages, addMessage };
}
