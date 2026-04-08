export interface Match {
    id: string;
    activityId: string;
    requesterId: string;
    accepterId: string;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    chatRoomId?: string;
    createdAt: Date;
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
    status: 'confirmed' | 'completed' | 'no_show' | 'cancelled';
    confirmedAt: Date;
    completedAt?: Date;
}
