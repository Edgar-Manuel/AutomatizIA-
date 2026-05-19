import { eq } from "drizzle-orm";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { db } from "@/db/client";
import { creditBalances, subscriptions } from "@/db/schema";
import { requireSessionOrRedirect } from "@/lib/auth/session";
import { MONTHLY_BUDGET_BY_TIER } from "@/lib/credits/budget";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSessionOrRedirect();

  const [balanceRow, subscriptionRow] = await Promise.all([
    db
      .select({ balance: creditBalances.balance })
      .from(creditBalances)
      .where(eq(creditBalances.organizationId, session.organizationId))
      .limit(1),
    db
      .select({ tier: subscriptions.tier })
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, session.organizationId))
      .limit(1),
  ]);
  const balance = balanceRow[0]?.balance ?? 0;
  const tier = subscriptionRow[0]?.tier ?? "free";
  const monthlyBudget = MONTHLY_BUDGET_BY_TIER[tier];

  return (
    <div className="min-h-dvh flex">
      <Sidebar balance={balance} monthlyBudget={monthlyBudget} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          email={session.email}
          organizationName={session.organizationName}
          balance={balance}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
