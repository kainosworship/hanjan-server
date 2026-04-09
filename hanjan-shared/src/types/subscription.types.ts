export type SubscriptionPlan = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';
export type PurchaseType = 'boost' | 'extra_turn' | 'timer_extension' | 'second_chance';

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  revenuecatId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  productId: string;
  purchaseType: PurchaseType;
  amount: number;
  currency: string;
  revenuecatId?: string;
  createdAt: Date;
}

export interface PlusAccess {
  hasPlus: boolean;
  source: 'subscription' | 'referral_reward' | null;
  expiresAt?: Date;
  plan?: SubscriptionPlan;
}
