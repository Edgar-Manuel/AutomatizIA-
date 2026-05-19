"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAgent } from "@/agents/_registry";
import { db } from "@/db/client";
import { agentExecutions, agents } from "@/db/schema";
import { requireSession } from "@/lib/auth/session";
import { chargeCreditsAtomic, refundCreditsAtomic } from "@/lib/credits/charge";
import { AgentNotFound, AppError, InvalidInput } from "@/lib/errors";
import { logger } from "@/lib/logger";

export type RunAgentResult =
  | {
      ok: true;
      executionId: string;
      output: unknown;
      creditsCharged: number;
      durationMs: number;
    }
  | {
      ok: false;
      error: { code: string; message: string; cta?: { label: string; href: string } };
    };

function toErrorPayload(err: unknown): RunAgentResult {
  if (err instanceof AppError) {
    return { ok: false, error: { code: err.code, message: err.userMessage, cta: err.cta } };
  }
  if (err instanceof z.ZodError) {
    const first = err.issues[0];
    return {
      ok: false,
      error: { code: "invalid_input", message: first?.message ?? "Revisa el formulario." },
    };
  }
  return {
    ok: false,
    error: {
      code: "unknown",
      message: "Ha fallado la ejecución. Inténtalo de nuevo en un momento.",
    },
  };
}

export async function runAgent(slug: string, rawInput: unknown): Promise<RunAgentResult> {
  try {
    const session = await requireSession();
    const agent = getAgent(slug);
    if (!agent) throw AgentNotFound(slug);

    const parsedInput = agent.inputSchema.safeParse(rawInput);
    if (!parsedInput.success) {
      const first = parsedInput.error.issues[0];
      throw InvalidInput(first?.message);
    }
    const input = parsedInput.data;

    const catalogRow = await db.query.agents.findFirst({
      where: (a, { eq: eqOp, and }) => and(eqOp(a.slug, slug), eqOp(a.isActive, true)),
    });
    if (!catalogRow) throw AgentNotFound(slug);

    const startedAt = Date.now();
    const executionId = randomUUID();

    await db.insert(agentExecutions).values({
      id: executionId,
      organizationId: session.organizationId,
      userId: session.userId,
      agentId: catalogRow.id,
      agentSlug: slug,
      status: "running",
      input,
      modelUsed: agent.model,
      creditsCharged: 0,
    });

    try {
      await chargeCreditsAtomic({
        organizationId: session.organizationId,
        amount: agent.creditsCost,
        agentExecutionId: executionId,
        idempotencyKey: `exec:${executionId}:charge`,
      });
    } catch (chargeErr) {
      await db
        .update(agentExecutions)
        .set({ status: "failed", errorMessage: "insufficient_credits", completedAt: new Date() })
        .where(eq(agentExecutions.id, executionId));
      throw chargeErr;
    }

    let output: unknown;
    try {
      output = await agent.execute(input, {
        organizationId: session.organizationId,
        userId: session.userId,
        executionId,
      });
    } catch (executionErr) {
      const message = executionErr instanceof Error ? executionErr.message : String(executionErr);
      logger.error({ slug, executionId, err: message }, "agent_execute_failed");

      await refundCreditsAtomic({
        organizationId: session.organizationId,
        amount: agent.creditsCost,
        agentExecutionId: executionId,
        idempotencyKey: `exec:${executionId}:refund`,
      });

      await db
        .update(agentExecutions)
        .set({
          status: "failed",
          errorMessage: message.slice(0, 500),
          completedAt: new Date(),
          creditsCharged: 0,
        })
        .where(eq(agentExecutions.id, executionId));

      throw executionErr;
    }

    const durationMs = Date.now() - startedAt;

    await db
      .update(agentExecutions)
      .set({
        status: "succeeded",
        output,
        completedAt: new Date(),
        durationMs,
        creditsCharged: agent.creditsCost,
      })
      .where(eq(agentExecutions.id, executionId));

    revalidatePath("/app", "layout");

    return {
      ok: true,
      executionId,
      output,
      creditsCharged: agent.creditsCost,
      durationMs,
    };
  } catch (err) {
    return toErrorPayload(err);
  }
}

// Re-export for tests
export { agents };
