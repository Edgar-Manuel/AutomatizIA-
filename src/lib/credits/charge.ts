import { eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { creditBalances } from "@/db/schema";
import { InsufficientCredits } from "@/lib/errors";

export async function getBalance(organizationId: string): Promise<number> {
  const [row] = await db
    .select({ balance: creditBalances.balance })
    .from(creditBalances)
    .where(eq(creditBalances.organizationId, organizationId))
    .limit(1);
  return row?.balance ?? 0;
}

export async function chargeCreditsAtomic(args: {
  organizationId: string;
  amount: number;
  agentExecutionId: string;
  idempotencyKey: string;
}): Promise<number> {
  try {
    const result = await db.execute<{ charge_credits: number }>(sql`
      select public.charge_credits(
        ${args.organizationId}::uuid,
        ${args.amount}::int,
        ${args.agentExecutionId}::uuid,
        ${args.idempotencyKey}
      ) as charge_credits
    `);
    const row = result[0];
    if (!row) throw new Error("charge_credits returned no row");
    return row.charge_credits;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("insufficient_credits")) {
      const balance = await getBalance(args.organizationId);
      throw InsufficientCredits(args.amount, balance);
    }
    throw err;
  }
}

export async function refundCreditsAtomic(args: {
  organizationId: string;
  amount: number;
  agentExecutionId: string;
  idempotencyKey: string;
}): Promise<number> {
  const result = await db.execute<{ refund_credits: number }>(sql`
    select public.refund_credits(
      ${args.organizationId}::uuid,
      ${args.amount}::int,
      ${args.agentExecutionId}::uuid,
      ${args.idempotencyKey}
    ) as refund_credits
  `);
  const row = result[0];
  if (!row) throw new Error("refund_credits returned no row");
  return row.refund_credits;
}
