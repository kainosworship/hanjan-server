export type ActivityCategory =
    | 'coffee'
    | 'meal'
    | 'drink'
    | 'walk'
    | 'culture'
    | 'anything';

export type ActivityTiming =
    | 'now'
    | '30min'
    | '1hour'
    | 'tonight'
    | 'custom';

export type GroupSize = '1:1' | '2:2' | 'group';

export interface Activity {
    id: string;
    userId: string;
    category: ActivityCategory;
    timing: ActivityTiming;
    scheduledAt: Date;
    radiusKm: 1 | 2 | 5;
    groupSize: GroupSize;
    message?: string;
    locationLat: number;
    locationLng: number;
    venueName?: string;
    venueAddress?: string;
    status: 'active' | 'matched' | 'expired' | 'cancelled';
    createdAt: Date;
    expiresAt: Date;
}

export interface ActivityCard extends Activity {
    user: {
        nickname: string;
        mannerScore: number;
        verifiedBadge: boolean;
        profileImageUrl?: string;
    };
    distanceMeters: number;
}
