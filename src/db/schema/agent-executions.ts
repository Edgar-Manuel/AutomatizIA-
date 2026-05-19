import { sql } from "drizzle-orm";
import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { agents } from "./agents";
import { executionStatus } from "./enums";
import { organizations } from "./organizations";
import { users } from "./users";

export const agentExecutions = pgTable("agent_executions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  agentId: uuid("agent_id")
    .notNull()
    .references(() => agents.id),
  agentSlug: text("agent_slug").notNull(),
  status: executionStatus("status").notNull().default("pending"),
  input: jsonb("input").notNull(),
  output: jsonb("output"),
  errorMessage: text("error_message"),
  modelUsed: text("model_used"),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  cacheReadTokens: integer("cache_read_tokens"),
  cacheWriteTokens: integer("cache_write_tokens"),
  creditsCharged: integer("credits_charged").notNull().default(0),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export type AgentExecution = typeof agentExecutions.$inferSelect;
