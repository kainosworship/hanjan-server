import { useSubscriptionStore } from '@/stores/subscriptionStore';

export function usePlusAccess() {
  const { plusAccess } = useSubscriptionStore();
  return {
    hasPlus: plusAccess.hasPlus,
    source: plusAccess.source,
    expiresAt: plusAccess.expiresAt,
  };
}
