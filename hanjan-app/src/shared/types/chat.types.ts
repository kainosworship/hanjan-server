export type ChatRoomStatus = 'active' | 'meeting_confirmed' | 'timer_expired' | 'closed';
export type MessageType = 'text' | 'venue_share' | 'meeting_proposal' | 'system';

export interface ChatRoom {
  id: string;
  matchId: string;
  status: ChatRoomStatus;
  timerStartedAt: Date;
  timerExpiresAt: Date;
  createdAt: Date;
  closedAt?: Date;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface SendMessageDto {
  content: string;
  messageType?: MessageType;
  metadata?: Record<string, unknown>;
}

export interface ShareVenueDto {
  venueName: string;
  venueAddress?: string;
  venueLat?: number;
  venueLng?: number;
}

export interface ConfirmMeetingDto {
  scheduledAt: Date;
}

export interface SocketEvents {
  JOIN_ROOM: 'join_room';
  SEND_MESSAGE: 'send_message';
  SHARE_VENUE: 'share_venue';
  PROPOSE_MEETING: 'propose_meeting';
  CONFIRM_MEETING: 'confirm_meeting';
  NEW_MESSAGE: 'new_message';
  TIMER_UPDATE: 'timer_update';
  TIMER_WARNING: 'timer_warning';
  TIMER_EXPIRED: 'timer_expired';
  MEETING_CONFIRMED: 'meeting_confirmed';
}
