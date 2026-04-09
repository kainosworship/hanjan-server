export type ReferralStatus = 'pending' | 'completed' | 'revoked';
export type RewardType = 'free_plus' | 'extend_plus';

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
  status: ReferralStatus;
  completedAt?: Date;
  createdAt: Date;
}

export interface ReferralReward {
  id: string;
  userId: string;
  rewardType: RewardType;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  triggeredByReferralIds: string[];
  createdAt: Date;
}

export interface ReferralStatus2 {
  totalInvited: number;
  completed: number;
  pending: number;
  currentCycle: {
    completed: number;
    needed: number;
  };
  rewards: ReferralReward[];
}

export interface ValidateReferralCodeDto {
  code: string;
}
