"use client";

import Link from "next/link";
import { useState } from "react";
import { DEPARTMENTS, FEATURED_AGENTS, type FeaturedAgent } from "./data";
import { IconArrowRight, IconClock, IconCoin } from "./icons";

const COLOR_MAP: Record<FeaturedAgent["color"], { bg: string; text: string; border: string }> = {
  brand: { bg: "bg-brand-50", text: "text-brand-700", border: "border-brand-100" },
  mint: { bg: "bg-mint-50", text: "text-mint-500", border: "border-mint-100" },
  coral: { bg: "bg-coral-50", text: "text-coral-500", border: "border-coral-100" },
};

function AgentCard({ agent }: { agent: FeaturedAgent }) {
  const c = COLOR_MAP[agent.color];
  return (
    <article className="agent-card group rounded-2xl bg-white border border-ink-200 hover:border-ink-300 hover:shadow-card p-5 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} border ${c.border} inline-flex items-center justify-center`}
        >
          <agent.Icon size={19} />
        </span>
        <span className="text-[10.5px] uppercase tracking-[0.12em] text-ink-400 mt-1.5">
          {agent.dept}
        </span>
      </div>
      <h3
        className="mt-4 text-[15.5px] font-semibold text-ink-900 leading-snug tracking-tight"
        style={{ textWrap: "balance" }}
      >
        {agent.name}
      </h3>
      <p className="mt-1.5 text-[13.5px] text-ink-500 leading-relaxed flex-1">{agent.desc}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11.5px] text-ink-400 inline-flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1">
            <IconCoin size={11} /> 1–4
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <IconClock size={11} /> &lt; 10s
          </span>
        </span>
        <button
          type="button"
          className="text-[12.5px] font-medium inline-flex items-center gap-1 text-ink-900 px-2.5 py-1.5 rounded-lg border border-ink-200 hover:border-ink-900 transition-colors"
        >
          Ver demo <IconArrowRight size={12} stroke={2} />
        </button>
      </div>
    </article>
  );
}

export function AgentsGrid() {
  const [activeDept, setActiveDept] = useState("todos");
  const filters = [
    { id: "todos", label: "Todos" },
    ...DEPARTMENTS.map((d) => ({ id: d.name, label: d.name })),
  ];
  const visible =
    activeDept === "todos" ? FEATURED_AGENTS : FEATURED_AGENTS.filter((a) => a.dept === activeDept);

  return (
    <section id="agentes" className="py-20 sm:py-28 bg-white border-y border-ink-200">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">
              Agentes destacados
            </div>
            <h2 className="mt-2 text-[34px] sm:text-[42px] tracking-[-0.02em] leading-[1.05] font-bold text-ink-900">
              Seis ejemplos. Hay otros cuarenta y cuatro.
            </h2>
            <p className="mt-4 text-[16px] text-ink-500 leading-relaxed">
              Todos están listos. No hay que entrenarlos ni configurarlos.
            </p>
          </div>
          <Link
            href="/signup"
            className="hidden md:inline-flex items-center gap-1.5 text-[13.5px] font-medium text-brand-700 hover:underline"
          >
            Ver el catálogo completo <IconArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              type="button"
              key={f.id}
              onClick={() => setActiveDept(f.id)}
              className={`text-[12.5px] px-3 py-1.5 rounded-full border transition-colors ${
                activeDept === f.id
                  ? "bg-ink-900 text-white border-ink-900"
                  : "bg-white text-ink-700 border-ink-200 hover:border-ink-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {visible.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-ink-200 p-10 text-center text-ink-400 text-[13.5px]">
              No hay agentes destacados en este departamento (todavía).
              <div className="mt-1 text-ink-700">El catálogo completo tiene más.</div>
            </div>
          )}
          {visible.map((a) => (
            <AgentCard key={a.id} agent={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
