import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { FEATURED_AGENTS } from "@/components/landing/data";
import { IconArrowRight, IconClock, IconCoin, IconSparkles } from "@/components/landing/icons";
import { db } from "@/db/client";
import { agentExecutions, agents } from "@/db/schema";
import { requireSessionOrRedirect } from "@/lib/auth/session";

export default async function AppDashboardPage() {
  const session = await requireSessionOrRedirect();

  const [activeAgents, recentExecutions] = await Promise.all([
    db.select().from(agents).where(eq(agents.isActive, true)),
    db
      .select({
        id: agentExecutions.id,
        slug: agentExecutions.agentSlug,
        status: agentExecutions.status,
        durationMs: agentExecutions.durationMs,
        createdAt: agentExecutions.createdAt,
        creditsCharged: agentExecutions.creditsCharged,
      })
      .from(agentExecutions)
      .where(eq(agentExecutions.organizationId, session.organizationId))
      .orderBy(desc(agentExecutions.createdAt))
      .limit(8),
  ]);

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-10 space-y-10">
      <section>
        <h1 className="text-[28px] sm:text-[32px] font-bold text-ink-900 tracking-tight">
          Buenas, ¿qué automatizamos hoy?
        </h1>
        <p className="mt-1.5 text-[14.5px] text-ink-500">
          Estamos en walking skeleton. Hay 1 agente real disponible. El catálogo completo llega en
          la siguiente fase.
        </p>
      </section>

      <section>
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-[18px] font-semibold text-ink-900 tracking-tight">
            Agentes disponibles
          </h2>
          <span className="text-[12px] text-ink-400 num-tab">
            {activeAgents.length} activo{activeAgents.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {activeAgents.map((agent) => {
            const meta = FEATURED_AGENTS.find(
              (f) => f.id === "reviews" && agent.slug === "google-reviews-responder",
            );
            const Icon = meta?.Icon;
            return (
              <Link
                key={agent.id}
                href={`/app/agents/${agent.slug}`}
                className="agent-card group rounded-2xl bg-white border border-ink-200 hover:border-ink-300 hover:shadow-card p-5 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="w-10 h-10 rounded-xl bg-mint-50 text-mint-500 border border-mint-100 inline-flex items-center justify-center">
                    {Icon ? <Icon size={19} /> : <IconSparkles size={19} />}
                  </span>
                  <span className="text-[10.5px] uppercase tracking-[0.12em] text-ink-400 mt-1.5">
                    {agent.department.replace("_", " ")}
                  </span>
                </div>
                <h3 className="mt-4 text-[15.5px] font-semibold text-ink-900 leading-snug tracking-tight">
                  {agent.name}
                </h3>
                <p className="mt-1.5 text-[13.5px] text-ink-500 leading-relaxed flex-1">
                  {agent.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11.5px] text-ink-400 inline-flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1">
                      <IconCoin size={11} /> {agent.creditsCost}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <IconClock size={11} /> &lt; 10s
                    </span>
                  </span>
                  <span className="text-[12.5px] font-medium inline-flex items-center gap-1 text-ink-900 px-2.5 py-1.5 rounded-lg border border-ink-200 group-hover:border-ink-900 transition-colors">
                    Abrir <IconArrowRight size={12} stroke={2} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-[18px] font-semibold text-ink-900 tracking-tight mb-5">
          Últimas ejecuciones
        </h2>
        {recentExecutions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 p-10 text-center">
            <div className="text-[14px] text-ink-700 font-medium">
              Aún no has ejecutado ningún agente.
            </div>
            <div className="mt-1 text-[13px] text-ink-500">
              Abre el agente de reseñas y pruébalo, te llevas la primera respuesta en segundos.
            </div>
          </div>
        ) : (
          <ul className="rounded-2xl border border-ink-200 bg-white divide-y divide-ink-100 overflow-hidden">
            {recentExecutions.map((e) => (
              <li key={e.id} className="px-4 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[13.5px] font-medium text-ink-900 truncate">{e.slug}</div>
                  <div className="text-[11.5px] text-ink-400 mt-0.5">
                    {new Date(e.createdAt).toLocaleString("es-ES")} · {e.creditsCharged} créditos
                    {e.durationMs ? ` · ${(e.durationMs / 1000).toFixed(1)}s` : ""}
                  </div>
                </div>
                <span
                  className={`text-[10.5px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    e.status === "succeeded"
                      ? "bg-mint-50 text-mint-500 border-mint-100"
                      : e.status === "failed"
                        ? "bg-coral-50 text-coral-500 border-coral-100"
                        : "bg-ink-50 text-ink-500 border-ink-100"
                  }`}
                >
                  {e.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
