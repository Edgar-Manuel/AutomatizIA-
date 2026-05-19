import { pgEnum } from "drizzle-orm/pg-core";

export const subscriptionTier = pgEnum("subscription_tier", [
  "free",
  "starter",
  "business",
  "scale",
]);
export type SubscriptionTier = (typeof subscriptionTier.enumValues)[number];

export const subscriptionStatus = pgEnum("subscription_status", [
  "active",
  "past_due",
  "canceled",
  "trialing",
]);
export type SubscriptionStatus = (typeof subscriptionStatus.enumValues)[number];

export const department = pgEnum("department", [
  "ventas",
  "marketing",
  "atencion_cliente",
  "operaciones",
  "rrhh",
  "finanzas",
]);
export type Department = (typeof department.enumValues)[number];

export const agentTier = pgEnum("agent_tier", ["starter", "business", "scale"]);
export type AgentTier = (typeof agentTier.enumValues)[number];

export const agentModel = pgEnum("agent_model", ["haiku-4.5", "sonnet-4.6", "opus-4.7"]);
export type AgentModel = (typeof agentModel.enumValues)[number];

export const executionStatus = pgEnum("execution_status", [
  "pending",
  "running",
  "succeeded",
  "failed",
]);
export type ExecutionStatus = (typeof executionStatus.enumValues)[number];

export const creditReason = pgEnum("credit_reason", [
  "signup_bonus",
  "agent_execution",
  "agent_refund",
  "stripe_topup",
  "adjustment",
]);
export type CreditReason = (typeof creditReason.enumValues)[number];
