import { apiGet, apiPost } from '@/services/apiClient';
import { useReferralStore } from '@/stores/referralStore';
import type { ReferralCode, ReferralReward } from 'hanjan-shared';

interface ReferralStatus {
  totalInvited: number;
  completed: number;
  pending: number;
  currentCycle: { completed: number; needed: number };
}

export function useReferral() {
  const { code, totalInvited, completed, cycleCompleted, cycleNeeded, rewards, setCode, setStatus, setRewards } = useReferralStore();

  const fetchCode = async (): Promise<ReferralCode> => {
    const result = await apiGet<ReferralCode>('/referrals/my-code');
    setCode(result);
    return result;
  };

  const fetchStatus = async (): Promise<ReferralStatus> => {
    const result = await apiGet<ReferralStatus>('/referrals/status');
    setStatus(result);
    return result;
  };

  const validateCode = async (referralCode: string): Promise<void> => {
    await apiPost('/referrals/validate', { code: referralCode });
  };

  const fetchRewards = async (): Promise<ReferralReward[]> => {
    const result = await apiGet<ReferralReward[]>('/referrals/reward-status');
    setRewards(result);
    return result;
  };

  return {
    code,
    totalInvited,
    completed,
    cycleCompleted,
    cycleNeeded,
    rewards,
    fetchCode,
    fetchStatus,
    validateCode,
    fetchRewards,
  };
}
