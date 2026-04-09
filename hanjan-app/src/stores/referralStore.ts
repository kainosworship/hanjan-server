import { create } from 'zustand';
import type { ReferralCode, ReferralReward } from 'hanjan-shared';

interface ReferralState {
  code: ReferralCode | null;
  totalInvited: number;
  completed: number;
  pending: number;
  cycleCompleted: number;
  cycleNeeded: number;
  rewards: ReferralReward[];
  setCode: (code: ReferralCode) => void;
  setStatus: (status: { totalInvited: number; completed: number; pending: number; currentCycle: { completed: number; needed: number } }) => void;
  setRewards: (rewards: ReferralReward[]) => void;
}

export const useReferralStore = create<ReferralState>((set) => ({
  code: null,
  totalInvited: 0,
  completed: 0,
  pending: 0,
  cycleCompleted: 0,
  cycleNeeded: 3,
  rewards: [],

  setCode: (code) => set({ code }),
  setStatus: (status) =>
    set({
      totalInvited: status.totalInvited,
      completed: status.completed,
      pending: status.pending,
      cycleCompleted: status.currentCycle.completed,
      cycleNeeded: status.currentCycle.needed,
    }),
  setRewards: (rewards) => set({ rewards }),
}));
