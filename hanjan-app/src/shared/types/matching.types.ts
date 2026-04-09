export type MatchStatus = 'pending' | 'accepted' | 'rejected' | 'expired';
export type MeetingStatus = 'confirmed' | 'completed' | 'no_show' | 'cancelled';

export interface Match {
  id: string;
  activityId: string;
  requesterId: string;
  accepterId: string;
  status: MatchStatus;
  chatRoomId?: string;
  createdAt: Date;
  respondedAt?: Date;
}

export interface Meeting {
  id: string;
  matchId: string;
  chatRoomId: string;
  venueName: string;
  venueAddress?: string;
  venueLat?: number;
  venueLng?: number;
  scheduledAt: Date;
  status: MeetingStatus;
  confirmedAt: Date;
  completedAt?: Date;
}

export interface RequestMatchDto {
  activityId: string;
}

export interface RespondMatchDto {
  accept: boolean;
}
