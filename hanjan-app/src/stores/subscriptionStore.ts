import { create } from 'zustand';
import type { Subscription, PlusAccess } from '@/shared';

interface SubscriptionState {
  subscription: Subscription | null;
  plusAccess: PlusAccess;
  setSubscription: (sub: Subscription | null) => void;
  setPlusAccess: (access: PlusAccess) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  plusAccess: { hasPlus: false, source: null },

  setSubscription: (subscription) => set({ subscription }),
  setPlusAccess: (plusAccess) => set({ plusAccess }),
}));
