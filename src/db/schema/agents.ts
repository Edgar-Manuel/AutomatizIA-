import { sql } from "drizzle-orm";
import { boolean, check, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { agentModel, agentTier, department } from "./enums";

export const agents = pgTable(
  "agents",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    department: department("department").notNull(),
    tierRequired: agentTier("tier_required").notNull(),
    creditsCost: integer("credits_cost").notNull(),
    model: agentModel("model").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  },
  (t) => [check("agents_credits_cost_positive", sql`${t.creditsCost} > 0`)],
);

export type AgentRow = typeof agents.$inferSelect;
