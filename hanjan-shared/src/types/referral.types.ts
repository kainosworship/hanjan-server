export interface ReferralCode {
    id: string;
    userId: string;
    code: string;
    createdAt: Date;
}

export interface Referral {
    id: string;
    referrerId: string;
    refereeId: string;
    status: 'pending' | 'completed' | 'revoked';
    completedAt?: Date;
    createdAt: Date;
}

export interface ReferralReward {
    id: string;
    userId: string;
    rewardType: 'free_plus' | 'extend_plus';
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    triggeredByReferralIds: string[];
    createdAt: Date;
}

export interface ReferralStatus {
    totalInvited: number;
    completed: number;
    pending: number;
    currentCycle: {
        completed: number;
        needed: number;
    };
    rewards: ReferralReward[];
}
