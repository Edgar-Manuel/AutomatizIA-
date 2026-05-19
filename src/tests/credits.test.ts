import { describe, expect, it } from "vitest";
import { MONTHLY_BUDGET_BY_TIER } from "@/lib/credits/budget";
import { AppError, InsufficientCredits, translateAnthropicError } from "@/lib/errors";

describe("Credits domain", () => {
  it("monthly budgets are positive and ordered by tier", () => {
    expect(MONTHLY_BUDGET_BY_TIER.free).toBeGreaterThan(0);
    expect(MONTHLY_BUDGET_BY_TIER.starter).toBeGreaterThan(MONTHLY_BUDGET_BY_TIER.free);
    expect(MONTHLY_BUDGET_BY_TIER.business).toBeGreaterThan(MONTHLY_BUDGET_BY_TIER.starter);
    expect(MONTHLY_BUDGET_BY_TIER.scale).toBeGreaterThan(MONTHLY_BUDGET_BY_TIER.business);
  });

  it("InsufficientCredits surfaces an actionable user message and CTA", () => {
    const err = InsufficientCredits(5, 2);
    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe("insufficient_credits");
    expect(err.userMessage).toContain("5");
    expect(err.userMessage).toContain("2");
    expect(err.cta).toEqual({ label: "Subir de plan", href: "/app/billing" });
  });

  it("Anthropic errors are translated to user-safe messages without leaking internals", () => {
    const rate = translateAnthropicError(new Error("rate_limit exceeded"));
    expect(rate.code).toBe("rate_limited");
    expect(rate.userMessage).not.toContain("rate_limit");

    const overloaded = translateAnthropicError(new Error("503 overloaded"));
    expect(overloaded.code).toBe("ai_overloaded");

    const auth = translateAnthropicError(new Error("invalid_api_key"));
    expect(auth.code).toBe("ai_misconfigured");

    const generic = translateAnthropicError(new Error("boom"));
    expect(generic.code).toBe("ai_failed");
    expect(generic.userMessage).toContain("No pudimos");
  });
});
