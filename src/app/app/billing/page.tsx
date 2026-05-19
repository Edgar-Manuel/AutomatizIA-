import { eq } from "drizzle-orm";
import Link from "next/link";
import { PLANS } from "@/components/landing/data";
import { IconArrowRight, IconCoin, IconShield, IconSparkles } from "@/components/landing/icons";
import { db } from "@/db/client";
import { creditBalances, subscriptions } from "@/db/schema";
import { requireSessionOrRedirect } from "@/lib/auth/session";
import { MONTHLY_BUDGET_BY_TIER } from "@/lib/credits/budget";

export default async function BillingPage() {
  const session = await requireSessionOrRedirect();

  const [balanceRow, subRow] = await Promise.all([
    db
      .select({ balance: creditBalances.balance })
      .from(creditBalances)
      .where(eq(creditBalances.organizationId, session.organizationId))
      .limit(1),
    db
      .select({ tier: subscriptions.tier, status: subscriptions.status })
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, session.organizationId))
      .limit(1),
  ]);

  const balance = balanceRow[0]?.balance ?? 0;
  const tier = subRow[0]?.tier ?? "free";
  const monthlyBudget = MONTHLY_BUDGET_BY_TIER[tier];

  return (
    <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-10 space-y-10">
      <header>
        <h1 className="text-[28px] sm:text-[32px] font-bold text-ink-900 tracking-tight">
          Facturación
        </h1>
        <p className="mt-1.5 text-[14.5px] text-ink-500">
          Aquí gestionas tu plan, tus créditos y tus facturas. La pasarela de pago llega en la
          próxima fase.
        </p>
      </header>

      <section className="rounded-2xl bg-white border border-ink-200 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-400">
              Plan actual
            </div>
            <div className="mt-1 text-[22px] font-bold text-ink-900 capitalize">{tier}</div>
            <div className="text-[12.5px] text-ink-500 mt-1">
              {tier === "free"
                ? "Cuenta de prueba con 20 créditos de bienvenida."
                : "Suscripción activa."}
            </div>
          </div>
          <div className="rounded-xl p-4 bg-ink-50 border border-ink-100 min-w-[220px]">
            <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-400">Saldo</div>
            <div className="mt-1 flex items-end gap-1.5">
              <span className="text-[28px] font-bold text-ink-900 num-tab">{balance}</span>
              <span className="text-[12px] text-ink-400 pb-1.5 num-tab">/ {monthlyBudget}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-ink-100 overflow-hidden">
              <div
                className="h-full bg-brand"
                style={{
                  width: `${monthlyBudget > 0 ? Math.min(100, (balance / monthlyBudget) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[12.5px] text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <IconShield size={13} className="text-mint-500" /> Datos en servidores UE
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1.5">
            <IconCoin size={13} className="text-brand" /> Cobramos por uso, sin permanencia
          </span>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-[18px] font-semibold text-ink-900 tracking-tight">
            Planes disponibles
          </h2>
          <span className="text-[12px] text-ink-400">Stripe se conecta en la fase 2</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl p-6 flex flex-col ${
                p.recommended ? "bg-ink-900 text-white" : "bg-white border border-ink-200"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3
                  className={`text-[18px] font-semibold tracking-tight ${p.recommended ? "text-white" : "text-ink-900"}`}
                >
                  {p.name}
                </h3>
                {p.recommended && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold bg-coral text-white rounded-full px-2 py-0.5 inline-flex items-center gap-1">
                    <IconSparkles size={10} /> Recomendado
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-end gap-1">
                <span
                  className={`text-[34px] font-bold leading-none num-tab ${p.recommended ? "text-white" : "text-ink-900"}`}
                >
                  {p.monthly}€
                </span>
                <span
                  className={`pb-1 text-[12.5px] ${p.recommended ? "text-white/70" : "text-ink-500"}`}
                >
                  / mes
                </span>
              </div>
              <div
                className={`mt-1 text-[12px] ${p.recommended ? "text-white/60" : "text-ink-400"}`}
              >
                {p.credits.toLocaleString("es-ES")} créditos / mes
              </div>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className={`mt-5 w-full py-2.5 rounded-xl text-[13.5px] font-medium inline-flex items-center justify-center gap-1.5 cursor-not-allowed ${
                  p.recommended ? "bg-white/10 text-white/70" : "bg-ink-100 text-ink-500"
                }`}
              >
                Disponible en fase 2
                <IconArrowRight size={13} stroke={2} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="text-[13px] text-ink-500">
        ¿Necesitas más créditos para probar?{" "}
        <Link href="/app" className="text-ink-900 font-medium hover:underline">
          Vuelve al panel
        </Link>{" "}
        o escríbenos a hola@automatizia.es.
      </div>
    </div>
  );
}
