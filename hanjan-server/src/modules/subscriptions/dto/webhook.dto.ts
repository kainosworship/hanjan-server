export interface RevenueCatWebhookEvent {
  type: string;
  id: string;
  app_user_id?: string;
  product_id?: string;
  period_type?: string;
  purchased_at_ms?: number;
  expiration_at_ms?: number;
  environment?: string;
}

export interface RevenueCatWebhookPayload {
  api_version: string;
  event: RevenueCatWebhookEvent;
}
