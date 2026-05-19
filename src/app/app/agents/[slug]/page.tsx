import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgent } from "@/agents/_registry";
import { AgentRunner } from "@/components/agents/agent-runner";
import { IconArrowRight, IconBolt, IconClock, IconCoin } from "@/components/landing/icons";
import { db } from "@/db/client";
import { agents } from "@/db/schema";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) return { title: "Agente no encontrado" };
  return { title: `${agent.name} · AutomatizIA` };
}

export default async function AgentPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  const [catalogRow] = await db
    .select()
    .from(agents)
    .where(and(eq(agents.slug, slug), eq(agents.isActive, true)))
    .limit(1);
  if (!catalogRow) notFound();

  return (
    <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-8 space-y-6">
      <nav className="text-[12px] text-ink-400 flex items-center gap-1.5">
        <Link href="/app" className="hover:text-ink-700">
          Panel
        </Link>
        <span>›</span>
        <span className="text-ink-700 capitalize">{catalogRow.department.replace("_", " ")}</span>
        <span>›</span>
        <span className="text-ink-900">{agent.name}</span>
      </nav>

      <header className="rounded-2xl bg-white border border-ink-200 p-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-mint-50 text-mint-500 border border-mint-100 inline-flex items-center justify-center">
              <IconBolt size={20} />
            </span>
            <div>
              <h1 className="text-[22px] font-bold text-ink-900 tracking-tight leading-tight">
                {agent.name}
              </h1>
              <p className="text-[13.5px] text-ink-500 mt-0.5">{agent.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[12.5px] text-ink-500 shrink-0">
          <span className="inline-flex items-center gap-1.5">
            <IconCoin size={13} />
            <span className="num-tab">{agent.creditsCost}</span> créditos
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconClock size={13} /> ~6s
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100 text-[11px] font-medium uppercase tracking-wider">
            {catalogRow.tierRequired}
          </span>
        </div>
      </header>

      <AgentRunner slug={slug} creditsCost={agent.creditsCost} />

      <div className="text-[12.5px] text-ink-400 flex items-center gap-1">
        <span>Después de ejecutar, encuentra el resultado en </span>
        <Link
          href="/app"
          className="text-ink-700 hover:text-ink-900 inline-flex items-center gap-0.5"
        >
          Últimas ejecuciones <IconArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
