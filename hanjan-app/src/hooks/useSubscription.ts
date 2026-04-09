import { apiGet } from '@/services/apiClient';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import type { Subscription, PlusAccess } from 'hanjan-shared';

export function useSubscription() {
  const { subscription, plusAccess, setSubscription, setPlusAccess } = useSubscriptionStore();

  const fetchStatus = async (): Promise<Subscription | null> => {
    const result = await apiGet<Subscription | null>('/subscriptions/status');
    setSubscription(result);
    return result;
  };

  const fetchPlusAccess = async (): Promise<PlusAccess> => {
    const result = await apiGet<PlusAccess>('/subscriptions/plus-access');
    setPlusAccess(result);
    return result;
  };

  return { subscription, plusAccess, fetchStatus, fetchPlusAccess };
}
