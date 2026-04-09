import { create } from 'zustand';
import type { ChatRoom, ChatMessage } from '@/shared';

interface ChatState {
  rooms: ChatRoom[];
  messages: Record<string, ChatMessage[]>;
  activeRoomId: string | null;
  timerSeconds: number;
  setRooms: (rooms: ChatRoom[]) => void;
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  addMessage: (roomId: string, message: ChatMessage) => void;
  setActiveRoom: (roomId: string | null) => void;
  setTimerSeconds: (seconds: number) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  rooms: [],
  messages: {},
  activeRoomId: null,
  timerSeconds: 30 * 60,

  setRooms: (rooms) => set({ rooms }),
  setMessages: (roomId, messages) =>
    set((state) => ({ messages: { ...state.messages, [roomId]: messages } })),
  addMessage: (roomId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), message],
      },
    })),
  setActiveRoom: (roomId) => set({ activeRoomId: roomId }),
  setTimerSeconds: (seconds) => set({ timerSeconds: seconds }),
}));
