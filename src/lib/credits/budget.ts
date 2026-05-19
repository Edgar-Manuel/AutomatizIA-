import type { SubscriptionTier } from "@/db/schema";

export const MONTHLY_BUDGET_BY_TIER: Record<SubscriptionTier, number> = {
  free: 20,
  starter: 200,
  business: 1000,
  scale: 4000,
};
