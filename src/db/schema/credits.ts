import { sql } from "drizzle-orm";
import { check, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { creditReason } from "./enums";
import { organizations } from "./organizations";

export const creditBalances = pgTable(
  "credit_balances",
  {
    organizationId: uuid("organization_id")
      .primaryKey()
      .references(() => organizations.id, { onDelete: "cascade" }),
    balance: integer("balance").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
  },
  (t) => [check("credit_balances_non_negative", sql`${t.balance} >= 0`)],
);

export const creditLedger = pgTable("credit_ledger", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  delta: integer("delta").notNull(),
  reason: creditReason("reason").notNull(),
  agentExecutionId: uuid("agent_execution_id"),
  idempotencyKey: text("idempotency_key").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

export type CreditBalance = typeof creditBalances.$inferSelect;
export type CreditLedgerEntry = typeof creditLedger.$inferSelect;
